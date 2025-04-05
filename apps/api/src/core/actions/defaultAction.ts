import path from 'node:path';
import {
  configMergedSchema,
  type OutputStyle,
  type ConfigBase,
  type ConfigMerged,
} from '../../config/configSchema';
import { logger } from '../../lib/logger';
import type { CrawlOptions } from '../../types';
import { pack, type PackResult } from '../packager';
import { rethrowValidationErrorIfZodError } from '../../utils/errorHandle';

export interface DefaultActionRunnerResult {
  packResult: PackResult;
  config: ConfigMerged;
}

export const runDefaultAction = async (
  directories: string[],
  cwd: string,
  options: CrawlOptions,
): Promise<DefaultActionRunnerResult> => {
  logger.info('Loaded Crawl options:', options);

  const targetPaths = directories.map((directory) =>
    path.resolve(cwd, directory),
  );

  const config = buildConfig(options);

  const packResult: PackResult = await pack(targetPaths, config, (message) => {
    logger.info(message);
  });

  return {
    packResult,
    config,
  };
};

/**
 * Builds Crawl configuration from options.
 *
 */
const buildConfig = (options: CrawlOptions): ConfigMerged => {
  const config: ConfigBase = {};

  if (options.output) {
    config.output = { filePath: options.output };
  }
  if (options.include) {
    config.include = options.include.split(',');
  }
  if (options.ignore) {
    config.ignore = { customPatterns: options.ignore.split(',') };
  }
  // Only apply gitignore setting if explicitly set to false
  if (options.gitignore === false) {
    config.ignore = { ...config.ignore, useGitignore: options.gitignore };
  }
  // Only apply defaultPatterns setting if explicitly set to false
  if (options.defaultPatterns === false) {
    config.ignore = {
      ...config.ignore,
      useDefaultPatterns: options.defaultPatterns,
    };
  }
  if (options.topFilesLen !== undefined) {
    config.output = {
      ...config.output,
      topFilesLength: options.topFilesLen,
    };
  }
  if (options.outputShowLineNumbers !== undefined) {
    config.output = {
      ...config.output,
      showLineNumbers: options.outputShowLineNumbers,
    };
  }
  if (options.copy) {
    config.output = { ...config.output, copyToClipboard: options.copy };
  }
  if (options.style) {
    config.output = {
      ...config.output,
      style: options.style.toLowerCase() as OutputStyle,
    };
  }
  if (options.parsableStyle !== undefined) {
    config.output = {
      ...config.output,
      parsableStyle: options.parsableStyle,
    };
  }
  // Only apply securityCheck setting if explicitly set to false
  if (options.securityCheck === false) {
    config.security = { enableSecurityCheck: options.securityCheck };
  }
  // Only apply fileSummary setting if explicitly set to false
  if (options.fileSummary === false) {
    config.output = {
      ...config.output,
      fileSummary: false,
    };
  }
  // Only apply directoryStructure setting if explicitly set to false
  if (options.directoryStructure === false) {
    config.output = {
      ...config.output,
      directoryStructure: false,
    };
  }
  if (options.removeComments !== undefined) {
    config.output = {
      ...config.output,
      removeComments: options.removeComments,
    };
  }
  if (options.removeEmptyLines !== undefined) {
    config.output = {
      ...config.output,
      removeEmptyLines: options.removeEmptyLines,
    };
  }
  if (options.headerText !== undefined) {
    config.output = { ...config.output, headerText: options.headerText };
  }

  if (options.compress !== undefined) {
    config.output = { ...config.output, compress: options.compress };
  }

  if (options.tokenCountEncoding) {
    config.tokenCount = { encoding: options.tokenCountEncoding };
  }
  if (options.instructionFilePath) {
    config.output = {
      ...config.output,
      instructionFilePath: options.instructionFilePath,
    };
  }
  if (options.includeEmptyDirectories) {
    config.output = {
      ...config.output,
      includeEmptyDirectories: options.includeEmptyDirectories,
    };
  }

  // Only apply gitSortByChanges setting if explicitly set to false
  if (options.gitSortByChanges === false) {
    config.output = {
      ...config.output,
      git: {
        ...config.output?.git,
        sortByChanges: false,
      },
    };
  }

  try {
    return configMergedSchema.parse(config);
  } catch (error) {
    rethrowValidationErrorIfZodError(error, 'Invalid cli arguments');
    throw error;
  }
};
