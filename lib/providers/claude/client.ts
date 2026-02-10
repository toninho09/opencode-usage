import { fetchWithTimeout } from "../../shared/utils";
import { readAuthConfig, type AuthProvider } from "../../shared/auth";
import type { ClaudeUsageResponse } from "./types";

const ANTHROPIC_API_BASE_URL = "https://api.anthropic.com";

export class ClaudeClient {
  private readonly apiBaseUrl = ANTHROPIC_API_BASE_URL;

  /**
   * Builds headers for authentication with Claude API
   */
  private buildClaudeHeaders(token: string): Record<string, string> {
    return {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "User-Agent": "claude-code/2.0.32",
      "Authorization": `Bearer ${token}`,
      "anthropic-beta": "oauth-2025-04-20",
    };
  }

  /**
   * Fetches usage data from Claude API
   */
  private async fetchClaudeUsage(authData: AuthProvider): Promise<ClaudeUsageResponse> {
    const token = authData.access || authData.refresh;

    if (!token) {
      throw new Error("No token found in Anthropic auth data");
    }

    const url = `${this.apiBaseUrl}/api/oauth/usage`;
    const response = await fetchWithTimeout(url, {
      headers: this.buildClaudeHeaders(token),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Fetches Claude usage data
   */
  async fetchUsage(): Promise<ClaudeUsageResponse | null> {
    const authConfig = readAuthConfig();

    if (!authConfig) {
      return null;
    }

    const authData = authConfig.anthropic;

    if (!authData) {
      return null;
    }

    return this.fetchClaudeUsage(authData);
  }

  /**
   * Checks if Claude is configured
   */
  isConfigured(): boolean {
    const authConfig = readAuthConfig();
    return !!authConfig?.anthropic;
  }
}
