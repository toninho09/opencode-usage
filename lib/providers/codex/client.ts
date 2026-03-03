import { fetchWithTimeout } from "../../shared/utils";
import { readAuthConfig } from "../../shared/auth";
import type { AuthProvider } from "../../shared/auth";
import type { CodexUsageResponse } from "./types";

const CHATGPT_BACKEND_BASE_URL = "https://chatgpt.com/backend-api";

export class CodexClient {
  private readonly apiBaseUrl = CHATGPT_BACKEND_BASE_URL;

  private extractAccountIdFromJwt(token: string): string | null {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) {
      return null;
    }

    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")) as {
        [key: string]: unknown;
      };

      const authClaim = payload["https://api.openai.com/auth"];
      if (!authClaim || typeof authClaim !== "object") {
        return null;
      }

      const accountId = (authClaim as { [key: string]: unknown })["chatgpt_account_id"];
      return typeof accountId === "string" ? accountId : null;
    } catch {
      return null;
    }
  }

  private getAuthData(): AuthProvider | null {
    const auth = readAuthConfig();
    return auth?.openai ?? null;
  }

  private getAccessToken(authData: AuthProvider): string | null {
    if (authData.access) {
      return authData.access;
    }
    return authData.refresh ?? null;
  }

  private getAccountId(authData: AuthProvider, token: string): string | null {
    if (authData.accountId) {
      return authData.accountId;
    }
    return this.extractAccountIdFromJwt(token);
  }

  private buildHeaders(token: string, accountId: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "OpenCode-Usage-Plugin/1.0",
    };

    if (accountId) {
      headers["ChatGPT-Account-Id"] = accountId;
    }

    return headers;
  }

  private async fetchCodexUsage(authData: AuthProvider): Promise<CodexUsageResponse> {
    const token = this.getAccessToken(authData);

    if (!token) {
      throw new Error("No OpenAI access token found in auth data");
    }

    const accountId = this.getAccountId(authData, token);
    const url = `${this.apiBaseUrl}/wham/usage`;

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: this.buildHeaders(token, accountId),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Codex API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async fetchUsage(): Promise<CodexUsageResponse | null> {
    const authData = this.getAuthData();

    if (!authData) {
      return null;
    }

    if (authData.type !== "oauth") {
      return null;
    }

    return this.fetchCodexUsage(authData);
  }

  isConfigured(): boolean {
    const authData = this.getAuthData();
    return !!(authData && authData.type === "oauth" && (authData.access || authData.refresh));
  }
}
