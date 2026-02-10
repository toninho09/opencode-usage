import { fetchWithTimeout } from "../../shared/utils";
import { readAuthConfig, type AuthProvider } from "../../shared/auth";
import type { ZaiUsageResponse } from "./types";

const ZAI_API_BASE_URL = "https://api.z.ai";

export class ZaiClient {
  private readonly apiBaseUrl = ZAI_API_BASE_URL;

  /**
   * Builds headers for authentication with Z.ai API
   */
  private buildZaiHeaders(apiKey: string): Record<string, string> {
    return {
      "Authorization": apiKey,
      "Content-Type": "application/json",
      "User-Agent": "OpenCode-Status-Plugin/1.0",
    };
  }

  /**
   * Fetches usage data from Z.ai API
   */
  private async fetchZaiUsage(authData: AuthProvider): Promise<ZaiUsageResponse> {
    const apiKey = authData.key;

    if (!apiKey) {
      throw new Error("No API key found in Z.ai auth data");
    }

    const url = `${this.apiBaseUrl}/api/monitor/usage/quota/limit`;
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: this.buildZaiHeaders(apiKey),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Z.ai API Error ${response.status}: ${errorText}`);
    }

    const data: ZaiUsageResponse = await response.json();

    if (!data.success || data.code !== 200) {
      throw new Error(`Z.ai API Error ${data.code}: ${data.msg || "Unknown error"}`);
    }

    return data;
  }

  /**
   * Fetches Z.ai usage data
   */
  async fetchUsage(): Promise<ZaiUsageResponse | null> {
    const authConfig = readAuthConfig();

    if (!authConfig) {
      return null;
    }

    const authData = authConfig["zai-coding-plan"];

    if (!authData || authData.type !== "api" || !authData.key) {
      return null;
    }

    return this.fetchZaiUsage(authData);
  }

  /**
   * Returns the Z.ai API key (for use in formatter)
   */
  getApiKey(): string | null {
    const authConfig = readAuthConfig();

    if (!authConfig) {
      return null;
    }

    const authData = authConfig["zai-coding-plan"];

    if (!authData || authData.type !== "api" || !authData.key) {
      return null;
    }

    return authData.key;
  }

  /**
   * Checks if Z.ai is configured
   */
  isConfigured(): boolean {
    const authConfig = readAuthConfig();
    const authData = authConfig?.["zai-coding-plan"];
    return !!(authData && authData.type === "api" && authData.key);
  }
}
