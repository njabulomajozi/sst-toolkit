/**
 * CLI Configuration Types
 */

export interface ICLIConfig {
  stage: string;
  app: string;
  region: string;
  awsProfile: string;
  isDryRun: boolean;
}

