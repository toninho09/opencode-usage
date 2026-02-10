import type { UsageProvider, ProviderMessage } from "../base";
import { CopilotClient } from "./client";
import { CopilotFormatter } from "./formatter";

const client = new CopilotClient();
const formatter = new CopilotFormatter();

export const copilotProvider: UsageProvider = {
  name: "GitHub Copilot",
  id: "copilot",
  description: "GitHub Copilot usage monitoring",

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

export default copilotProvider;
