import { XMLBuilder } from 'fast-xml-parser';
import Handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import type { ProcessedFile } from '../file/fileTypes';
import type {
  OutputGeneratorContext,
  RenderContext,
} from './outputGeneratorTypes';
import type { ConfigMerged } from '../../config/configSchema';
import { getXmlTemplate } from './outputStyles/xmlStyle';
import { getMarkdownTemplate } from './outputStyles/markdownStyle';
import { getPlainTemplate } from './outputStyles/plainStyle';
import { generateTreeString } from '../file/fileTreeGenerate';
import { type FileSearchResult, searchFiles } from '../file/fileSearch';

const calculateMarkdownDelimiter = (
  files: ReadonlyArray<ProcessedFile>,
): string => {
  const maxBackticks = files
    .flatMap((file) => file.content.match(/`+/g) ?? [])
    .reduce((max, match) => Math.max(max, match.length), 0);

  return '`'.repeat(Math.max(3, maxBackticks + 1));
};

const createRenderContext = (
  outputGeneratorContext: OutputGeneratorContext,
): RenderContext => {
  return {
    processedFiles: outputGeneratorContext.processedFiles,
    markdownCodeBlockDelimiter: calculateMarkdownDelimiter(
      outputGeneratorContext.processedFiles,
    ),
  };
};

const generateParsableXMLOutput = async (
  renderContext: RenderContext,
): Promise<string> => {
  const xmlBuilder = new XMLBuilder({ ignoreAttributes: false });
  const xmlDocument = {
    codecrawl: {
      files: {
        '#text':
          "This section contains the contents of the repository's files.",
        file: renderContext.processedFiles.map((file) => ({
          '#text': file.content,
          '@_path': file.path,
        })),
      },
    },
  };

  try {
    return xmlBuilder.build(xmlDocument);
  } catch (error) {
    throw new Error(
      `Failed to generate XML output: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

const generateHandlebarOutput = async (
  config: ConfigMerged,
  renderContext: RenderContext,
): Promise<string> => {
  let template: string;
  switch (config.output.style) {
    case 'xml':
      template = getXmlTemplate();
      break;
    case 'markdown':
      template = getMarkdownTemplate();
      break;
    case 'plain':
      template = getPlainTemplate();
      break;
    default:
      throw new Error(`Unknown output style: ${config.output.style}`);
  }

  try {
    const compiledTemplate = Handlebars.compile(template);
    return `${compiledTemplate(renderContext).trim()}\n`;
  } catch (error) {
    throw new Error(
      `Failed to compile template: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const buildOutputGeneratorContext = async (
  rootDirs: string[],
  config: ConfigMerged,
  allFilePaths: string[],
  processedFiles: ProcessedFile[],
): Promise<OutputGeneratorContext> => {
  let repositoryInstruction = '';

  if (config.output.instructionFilePath) {
    const instructionPath = path.resolve(
      config.cwd,
      config.output.instructionFilePath,
    );
    try {
      repositoryInstruction = await fs.readFile(instructionPath, 'utf-8');
    } catch {
      throw new Error(`Instruction file not found at ${instructionPath}`);
    }
  }

  let emptyDirPaths: string[] = [];
  if (config.output.includeEmptyDirectories) {
    try {
      emptyDirPaths = (
        await Promise.all(
          rootDirs.map((rootDir) => searchFiles(rootDir, config)),
        )
      ).reduce(
        (acc: FileSearchResult, curr: FileSearchResult) =>
          ({
            filePaths: [...acc.filePaths, ...curr.filePaths],
            emptyDirPaths: [...acc.emptyDirPaths, ...curr.emptyDirPaths],
          }) as FileSearchResult,
        { filePaths: [], emptyDirPaths: [] },
      ).emptyDirPaths;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to search for empty directories: ${error.message}`,
        );
      }
    }
  }

  return {
    generationDate: new Date().toISOString(),
    treeString: generateTreeString(allFilePaths, emptyDirPaths),
    processedFiles,
    config,
    instruction: repositoryInstruction,
  };
};
