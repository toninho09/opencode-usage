import type { UsageProvider, ProviderMessage } from "../base";
import { ZaiClient } from "./client";
import { ZaiFormatter } from "./formatter";

const client = new ZaiClient();
const formatter = new ZaiFormatter();

export const zaiProvider: UsageProvider = {
  name: "Z.ai Coding Plan",
  id: "zai",
  description: "Monitoramento de uso do Z.ai Coding Plan",

  async getUsageData(): Promise<ProviderMessage | null> {
    try {
      const data = await client.fetchUsage();
      if (!data) {
        return null;
      }

      const apiKey = client.getApiKey();
      if (!apiKey) {
        return null;
      }

      return {
        content: formatter.format(data, apiKey),
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

export default zaiProvider;
