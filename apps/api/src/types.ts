import type { OutputStyle } from './config/configSchema';

export type CrawlProgressCallback = (message: string) => void;

export interface CrawlOptions {
  // Basic Options
  version?: boolean;

  // Output Options
  output?: string;
  style?: OutputStyle;
  parsableStyle?: boolean;
  compress?: boolean;
  outputShowLineNumbers?: boolean;
  copy?: boolean;
  fileSummary?: boolean;
  directoryStructure?: boolean;
  removeComments?: boolean;
  removeEmptyLines?: boolean;
  headerText?: string;
  instructionFilePath?: string;
  includeEmptyDirectories?: boolean;
  gitSortByChanges?: boolean;

  // Filter Options
  include?: string;
  ignore?: string;
  gitignore?: boolean;
  defaultPatterns?: boolean;

  // Remote Repository Options
  remote?: string;
  remoteBranch?: string;

  // Configuration Options
  config?: string;
  init?: boolean;
  global?: boolean;

  // Security Options
  securityCheck?: boolean;

  // Token Count Options
  tokenCountEncoding?: string;

  // Other Options
  topFilesLen?: number;
  verbose?: boolean;
  quiet?: boolean;
}
