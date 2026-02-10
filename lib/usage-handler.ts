import { sendIgnoredMessage } from "./shared/notification";
import { registry } from "./providers/registry";

interface UsageContext {
  client: any;
  sessionID: string;
  params: any;
}

/**
 * Main handler for the /usage command
 * Fetches data from all registered providers and displays to user
 */
export async function handleUsageCommand(ctx: UsageContext): Promise<void> {
  const { client, sessionID, params } = ctx;

  // Gets all registered providers
  const providers = registry.getAll();

  // Fetches data from all providers in parallel
  const results = await Promise.all(
    providers.map(async (provider) => {
      try {
        const result = await provider.getUsageData();
        if (result && result.content) {
          return {
            provider: provider.name,
            content: result.content,
          };
        }
        return null;
      } catch (error) {
        console.error(`[${provider.name} Error]`, error);
        return null;
      }
    }),
  );

  // Filters only providers with valid data
  const validResults = results.filter((r): r is { provider: string; content: string } => r !== null);

  // If no provider returned data, shows error message
  if (validResults.length === 0) {
    const message =
      "No usage service configured.\nConfigure GitHub Copilot, Claude Code or Z.ai in your auth file.";
    await sendIgnoredMessage(client, sessionID, message, params);
    return;
  }

  // Joins all provider messages
  const message = validResults.map((r) => r.content).join("\n\n");

  // Sends final message to user
  await sendIgnoredMessage(client, sessionID, message, params);
}
