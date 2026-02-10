import { fetchWithTimeout } from "../../shared/utils";
import { readAuthConfig, type AuthProvider } from "../../shared/auth";
import type { CopilotUsageResponse, CopilotTokenResponse } from "./types";

const GITHUB_API_BASE_URL = "https://api.github.com";

const COPILOT_VERSION = "0.35.0";
const EDITOR_VERSION = "vscode/1.107.0";
const EDITOR_PLUGIN_VERSION = `copilot-chat/${COPILOT_VERSION}`;
const USER_AGENT = `GitHubCopilotChat/${COPILOT_VERSION}`;

const COPILOT_HEADERS = {
  "User-Agent": USER_AGENT,
  "Editor-Version": EDITOR_VERSION,
  "Editor-Plugin-Version": EDITOR_PLUGIN_VERSION,
  "Copilot-Integration-Id": "vscode-chat",
};

export class CopilotClient {
  private readonly apiBaseUrl = GITHUB_API_BASE_URL;

  /**
   * Builds headers for authentication with Bearer token
   */
  private buildGitHubHeaders(token: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...COPILOT_HEADERS,
    };
  }

  /**
   * Builds headers for legacy authentication (token prefix)
   */
  private buildLegacyHeaders(token: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `token ${token}`,
      ...COPILOT_HEADERS,
    };
  }

  /**
   * Exchanges OAuth token for specific Copilot token
   */
  private async exchangeForCopilotToken(oauthToken: string): Promise<string | null> {
    try {
      const response = await fetchWithTimeout(
        `${this.apiBaseUrl}/copilot_internal/v2/token`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${oauthToken}`,
            ...COPILOT_HEADERS,
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const tokenData: CopilotTokenResponse = await response.json();
      return tokenData.token;
    } catch {
      return null;
    }
  }

  /**
   * Strategy 1: Try with cached token if still valid
   */
  private async fetchWithCachedToken(
    cachedAccessToken: string,
    tokenExpiry: number,
    oauthToken: string,
  ): Promise<CopilotUsageResponse | null> {
    if (!cachedAccessToken || cachedAccessToken === oauthToken || tokenExpiry <= Date.now()) {
      return null;
    }

    const response = await fetchWithTimeout(
      `${this.apiBaseUrl}/copilot_internal/user`,
      { headers: this.buildGitHubHeaders(cachedAccessToken) },
    );

    if (response.ok) {
      return response.json() as Promise<CopilotUsageResponse>;
    }

    return null;
  }

  /**
   * Strategy 2: Try with direct OAuth token (legacy format)
   */
  private async fetchWithLegacyToken(oauthToken: string): Promise<CopilotUsageResponse | null> {
    const response = await fetchWithTimeout(
      `${this.apiBaseUrl}/copilot_internal/user`,
      { headers: this.buildLegacyHeaders(oauthToken) },
    );

    if (response.ok) {
      return response.json() as Promise<CopilotUsageResponse>;
    }

    return null;
  }

  /**
   * Strategy 3: Exchange OAuth token for Copilot token and fetch
   */
  private async fetchWithExchangedToken(oauthToken: string): Promise<CopilotUsageResponse> {
    const copilotToken = await this.exchangeForCopilotToken(oauthToken);

    if (!copilotToken) {
      throw new Error("Failed to exchange OAuth token for Copilot token");
    }

    const response = await fetchWithTimeout(
      `${this.apiBaseUrl}/copilot_internal/user`,
      { headers: this.buildGitHubHeaders(copilotToken) },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<CopilotUsageResponse>;
  }

  /**
   * Tries to fetch usage data using multiple authentication strategies
   */
  private async fetchWithAuthStrategies(authData: AuthProvider): Promise<CopilotUsageResponse> {
    const oauthToken = authData.refresh || authData.access;
    if (!oauthToken) {
      throw new Error("No OAuth token found in auth data");
    }

    const cachedAccessToken = authData.access || "";
    const tokenExpiry = authData.expires || 0;

    // Strategy 1: Try with cached token
    const cachedResult = await this.fetchWithCachedToken(cachedAccessToken, tokenExpiry, oauthToken);
    if (cachedResult) {
      return cachedResult;
    }

    // Strategy 2: Try with direct OAuth token
    const legacyResult = await this.fetchWithLegacyToken(oauthToken);
    if (legacyResult) {
      return legacyResult;
    }

    // Strategy 3: Exchange token and try again
    return this.fetchWithExchangedToken(oauthToken);
  }

  /**
   * Fetches Copilot usage data
   */
  async fetchUsage(): Promise<CopilotUsageResponse | null> {
    const auth = readAuthConfig();
    const copilotAuth = auth?.["github-copilot"];

    if (!copilotAuth?.refresh) {
      return null;
    }

    return this.fetchWithAuthStrategies(copilotAuth);
  }

  /**
   * Checks if Copilot is configured
   */
  isConfigured(): boolean {
    const auth = readAuthConfig();
    return !!auth?.["github-copilot"]?.refresh;
  }
}
