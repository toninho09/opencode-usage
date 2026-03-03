import type { UsageProvider, ProviderMessage } from "../base";
import { CodexClient } from "./client";
import { CodexFormatter } from "./formatter";

const client = new CodexClient();
const formatter = new CodexFormatter();

export const codexProvider: UsageProvider = {
  name: "GPT Codex",
  id: "codex",
  description: "OpenAI Codex usage monitoring",

  async getUsageData(): Promise<ProviderMessage | null> {
    try {
      const data = await client.fetchUsage();
      if (!data) {
        return null;
      }

      return {
        content: formatter.format(data),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: formatter.formatError(message),
        error: message,
      };
    }
  },

  isConfigured(): boolean {
    return client.isConfigured();
  },
};

export default codexProvider;
