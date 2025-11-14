/**
 * Confirmation Utility
 * Handles user confirmation prompts (SRP)
 */

export async function askConfirmation(message: string): Promise<boolean> {
  const readline = await import("node:readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(`${message} (yes/no): `, resolve);
  });
  rl.close();

  return answer.toLowerCase() === "yes" || answer.toLowerCase() === "y";
}

export function requireConfirmation(resourceCount: number, isDryRun: boolean): Promise<boolean> {
  if (isDryRun) {
    return Promise.resolve(true);
  }

  const message = `⚠️  You are about to delete ${resourceCount} resource(s). This action cannot be undone.\n   Are you sure you want to continue?`;
  return askConfirmation(message);
}

