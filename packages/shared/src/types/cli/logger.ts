/**
 * CLI Logger Types
 */

export interface ILogger {
  log(message: string, color?: string): void;
  error(message: string): void;
  success(message: string): void;
  info(message: string): void;
  warn(message: string): void;
}

