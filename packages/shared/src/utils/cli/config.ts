/**
 * Configuration Utility
 * Centralized configuration management (SRP)
 */

import type { ICLIConfig } from "../../types/cli/config";

export function loadConfig(args: string[]): ICLIConfig {
  const isForce = args.includes("--force") || args.includes("-f");
  
  return {
    stage: process.env.SST_STAGE || "dev",
    app: process.env.SST_APP || "insights",
    region: process.env.AWS_REGION || "us-east-1",
    awsProfile: process.env.AWS_PROFILE || "onglx-dev-creds",
    isDryRun: !isForce,
  };
}

