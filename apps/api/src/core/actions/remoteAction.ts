import * as fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import GitUrlParse, { type GitUrl } from 'git-url-parse';

import {
  runDefaultAction,
  type DefaultActionRunnerResult,
} from './defaultAction';
import { execGitShallowClone, isGitInstalled } from '../file/gitCommand';
import { logger } from '../../lib/logger';
import type { CrawlOptions } from '../../types';

interface IGitUrl extends GitUrl {
  commit: string | undefined;
}

export const runRemoteAction = async (
  repoUrl: string,
  options: CrawlOptions,
  deps = { isGitInstalled, execGitShallowClone, runDefaultAction },
): Promise<DefaultActionRunnerResult> => {
  if (!(await deps.isGitInstalled())) {
    throw new Error('Git is not installed or not in the system PATH.');
  }

  const parsedFields = parseRemoteValue(repoUrl);
  const tempDirPath = await createTempDirectory();
  let result: DefaultActionRunnerResult;

  try {
    // Clone the repository
    await cloneRepository(
      parsedFields.repoUrl,
      tempDirPath,
      options.remoteBranch || parsedFields.remoteBranch,
      {
        execGitShallowClone: deps.execGitShallowClone,
      },
    );

    // Run the default action on the cloned repository
    result = await deps.runDefaultAction([tempDirPath], tempDirPath, options);
    // if (!result.config.output.filePath) {
    //   throw new Error('Output file path is not defined');
    // }
    // await copyOutputToCurrentDirectory(
    //   tempDirPath,
    //   process.cwd(),
    //   result.config.output.filePath,
    // );
  } finally {
    // Cleanup the temporary directory
    await cleanupTempDirectory(tempDirPath);
  }

  return result;
};

export const isValidRemoteValue = (remoteValue: string): boolean => {
  try {
    parseRemoteValue(remoteValue);
    return true;
  } catch (error) {
    return false;
  }
};

// Check the short form of the GitHub URL. e.g. irere123/run-lang
const VALID_NAME_PATTERN = '[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?';
const validShorthandRegex = new RegExp(
  `^${VALID_NAME_PATTERN}/${VALID_NAME_PATTERN}$`,
);
export const isValidShorthand = (remoteValue: string): boolean => {
  return validShorthandRegex.test(remoteValue);
};

export const parseRemoteValue = (
  remoteValue: string,
): { repoUrl: string; remoteBranch: string | undefined } => {
  if (isValidShorthand(remoteValue)) {
    logger.info(`Formatting GitHub shorthand: ${remoteValue}`);
    return {
      repoUrl: `https://github.com/${remoteValue}.git`,
      remoteBranch: undefined,
    };
  }

  try {
    const parsedFields = GitUrlParse(remoteValue) as IGitUrl;

    // This will make parsedFields.toString() automatically append '.git' to the returned url
    parsedFields.git_suffix = true;

    const ownerSlashRepo =
      parsedFields.full_name.split('/').length > 1
        ? parsedFields.full_name.split('/').slice(-2).join('/')
        : '';

    if (ownerSlashRepo !== '' && !isValidShorthand(ownerSlashRepo)) {
      throw new Error('Invalid owner/repo in repo URL');
    }

    const repoUrl = parsedFields.toString(parsedFields.protocol);

    if (parsedFields.ref) {
      return {
        repoUrl: repoUrl,
        remoteBranch: parsedFields.filepath
          ? `${parsedFields.ref}/${parsedFields.filepath}`
          : parsedFields.ref,
      };
    }

    if (parsedFields.commit) {
      return {
        repoUrl: repoUrl,
        remoteBranch: parsedFields.commit,
      };
    }

    return {
      repoUrl: repoUrl,
      remoteBranch: undefined,
    };
  } catch (error) {
    throw new Error(
      'Invalid remote repository URL or repository shorthand (owner/repo)',
    );
  }
};

export const createTempDirectory = async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'crawl-'));
  logger.info(`Created temporary directory. (path: ${tempDir})`);
  return tempDir;
};

export const cloneRepository = async (
  url: string,
  directory: string,
  remoteBranch?: string,
  deps = { execGitShallowClone },
): Promise<void> => {
  logger.info(
    `Clone repository: ${url} to temporary directory. path: ${directory}`,
  );

  try {
    await deps.execGitShallowClone(url, directory, remoteBranch);
  } catch (error) {
    throw new Error(`Failed to clone repository: ${(error as Error).message}`);
  }
};

export const cleanupTempDirectory = async (
  directory: string,
): Promise<void> => {
  logger.info(`Cleaning up temporary directory: ${directory}`);
  await fs.rm(directory, { recursive: true, force: true });
};

export const copyOutputToCurrentDirectory = async (
  sourceDir: string,
  targetDir: string,
  outputFileName: string,
): Promise<void> => {
  const sourcePath = path.resolve(sourceDir, outputFileName);
  const targetPath = path.resolve(targetDir, outputFileName);

  try {
    logger.info(`Copying output file from: ${sourcePath} to: ${targetPath}`);

    // Create target directory if it doesn't exist
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    throw new Error(`Failed to copy output file: ${(error as Error).message}`);
  }
};
