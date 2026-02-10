import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const AUTH_CONFIG_PATH = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "auth.json",
);

export interface AuthProvider {
  type?: string;
  access?: string;
  refresh?: string;
  expires?: number;
  username?: string;
  key?: string;
}

export interface AuthConfig {
  "github-copilot"?: AuthProvider;
  "anthropic"?: AuthProvider;
  "zai-coding-plan"?: AuthProvider;
}

/**
 * Reads the OpenCode authentication configuration file
 * Returns null if file doesn't exist or error reading
 */
export function readAuthConfig(): AuthConfig | null {
  try {
    if (!fs.existsSync(AUTH_CONFIG_PATH)) {
      return null;
    }
    const content = fs.readFileSync(AUTH_CONFIG_PATH, "utf-8");
    return JSON.parse(content) as AuthConfig;
  } catch {
    return null;
  }
}

/**
 * Returns the authentication configuration file path
 */
export function getAuthConfigPath(): string {
  return AUTH_CONFIG_PATH;
}
