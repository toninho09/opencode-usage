import type { UsageProvider, ProviderMessage } from "../base";
import { ClaudeClient } from "./client";
import { ClaudeFormatter } from "./formatter";

const client = new ClaudeClient();
const formatter = new ClaudeFormatter();

export const claudeProvider: UsageProvider = {
  name: "Claude Code",
  id: "claude",
  description: "Monitoramento de uso do Claude Code",

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
      return {
        content: "",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  isConfigured(): boolean {
    return client.isConfigured();
  },
};

export default claudeProvider;
