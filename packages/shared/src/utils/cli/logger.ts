/**
 * Logger Utility
 * Centralized logging with colors (SRP)
 */

import type { ILogger } from "../../types/cli/logger";

export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

class Logger implements ILogger {
  log(message: string, color: string = colors.reset): void {
    console.log(`${color}${message}${colors.reset}`);
  }

  error(message: string): void {
    console.error(`${colors.red}${message}${colors.reset}`);
  }

  success(message: string): void {
    console.log(`${colors.green}${message}${colors.reset}`);
  }

  info(message: string): void {
    console.log(`${colors.cyan}${message}${colors.reset}`);
  }

  warn(message: string): void {
    console.log(`${colors.yellow}${message}${colors.reset}`);
  }
}

export const logger = new Logger();

