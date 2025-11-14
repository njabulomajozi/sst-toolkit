/**
 * Shared Types for Resource Cleanup
 */

export interface IResource {
  arn: string;
  service: string;
  region: string;
  resourceId: string;
  resourceType: string;
}

export interface ITagFilter {
  key: string;
  value: string;
}

export interface IFinderOptions {
  stage?: string;
  app?: string;
  tags?: ITagFilter[];
  tagMatch?: "AND" | "OR";
  region?: string;
  awsProfile?: string;
}

export interface IRemoverOptions {
  region?: string;
  awsProfile?: string;
  dryRun?: boolean;
}

export interface IRemoverResult {
  success: boolean;
  error?: string;
}

