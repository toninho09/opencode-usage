# OpenCode Plugin - Agent Guidelines

## Development Commands

### Type Checking
```bash
npx tsc --noEmit
```
Run TypeScript compiler in check-only mode. No files are emitted due to `noEmit: true` in tsconfig.json.

**Note:** This project has no build, lint, or test scripts configured in package.json. Focus on type correctness and follow established code patterns.

## Code Style Guidelines

### Imports
- Use ES6 module syntax with named imports preferred over default imports
- Explicit type-only imports with `import type { }` for TypeScript types
- Node.js built-in modules: Use `import * as fs from "fs"` or modern `import { } from "node:stream"` protocol
- Import order: type imports first, then external dependencies, then internal modules
- Group related imports together

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { fetchWithTimeout, createProgressBar } from "./utils"
import type { QueryResult } from "./types"
```

### Formatting
- **Indentation:** 2 spaces (no tabs)
- **Semicolons:** Required at end of statements
- **Quotes:** Double quotes for strings (observed in codebase)
- **Trailing commas:** Allowed in multi-line arrays/objects
- **Line length:** Reasonable limits, prioritize readability over strict line length

### TypeScript & Types
- **Interfaces:** Use for object shapes, API responses, and contracts (`interface QueryResult`, `interface AuthConfig`)
- **Type aliases:** Use for unions and when exporting existing types (`export type { CopilotUsageResponse }`)
- **Annotations:** Explicit types required for function parameters and return types
- **Type assertions:** Use `as Type` sparingly, prefer type guards and narrowing
- **External types:** Use `any` for library types without definitions, add comments explaining usage
- **Strict mode:** Enabled in tsconfig.json - no implicit any, strict null checks

```typescript
interface AuthProvider {
  access?: string
  refresh?: string
  expires?: number
  username?: string
  type?: string
}

interface AuthConfig {
  "github-copilot"?: AuthProvider
  "anthropic"?: AuthProvider
}

export async function fetchCopilotUsage(authData: AuthProvider): Promise<CopilotUsageResponse>
```

### Naming Conventions
- **Functions/Variables:** camelCase (`getCopilotUsageData`, `oauthToken`, `resetCountdown`)
- **Interfaces/Types:** PascalCase (`QueryResult`, `CopilotUsageResponse`, `AuthProvider`)
- **Constants:** SCREAMING_SNAKE_CASE (`GITHUB_API_BASE_URL`, `COPILOT_HEADERS`, `AUTH_CONFIG_PATH`)
- **File names:** kebab-case (`copilot-handler.ts`, `notification.ts`, `usage-handler.ts`)
- **Private functions:** No prefix, simply not exported from module
- **Exported functions:** Export individually using `export function` or `export async function`

### Error Handling
- Always wrap network operations in try-catch blocks
- Check `instanceof Error` before accessing error properties
- Throw errors for critical failures (authentication, configuration issues)
- Return `null` for non-critical failures (token exchange, optional file reads)
- Provide descriptive error messages with context and status codes

```typescript
// Critical error - throw
if (!oauthToken) {
  throw new Error("No OAuth token found in auth data")
}

// Network error with detailed context
try {
  const response = await fetchWithTimeout(url, { headers })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GitHub API Error ${response.status}: ${errorText}`)
  }
  return await response.json()
} catch (err) {
  return {
    success: false,
    error: err instanceof Error ? err.message : String(err)
  }
}

// Non-critical failure - return null
function readAuthConfig(): AuthConfig | null {
  try {
    if (!fs.existsSync(AUTH_CONFIG_PATH)) {
      return null
    }
    const content = fs.readFileSync(AUTH_CONFIG_PATH, "utf-8")
    return JSON.parse(content) as AuthConfig
  } catch {
    return null
  }
}
```

### File Organization
- **Entry point:** `index.ts` - plugin registration, command setup, exports `TestPlugin`
- **Library code:** `lib/` directory for all implementation
- **Types:** `lib/types.ts` - shared interfaces and type definitions
- **Utilities:** `lib/utils.ts` - reusable helper functions (`fetchWithTimeout`, `createProgressBar`)
- **Feature modules:** One concern per file (`copilot.ts`, `claude.ts`)
- **Handlers:** `lib/*-handler.ts` - command handlers with output formatting
- **Services:** `lib/notification.ts` - cross-cutting services like message sending

### Function Design
- **Small functions:** Single responsibility principle, aim for < 50 lines per function
- **Internal vs exported:** Keep implementation details internal, export only public APIs
- **Parameter objects:** Use interfaces for complex function parameters
- **Pure functions:** Prefer pure functions for formatting and data transformation
- **Async patterns:** Use explicit `async/await`, avoid callback patterns

```typescript
// Internal helper - not exported
function formatQuotaLine(name: string, quota: QuotaDetail | undefined, width: number = 20): string {
  if (!quota) return ""
  if (quota.unlimited) {
    return `${name.padEnd(14)} Unlimited`
  }
  const total = quota.entitlement
  const used = total - quota.remaining
  const percentRemaining = Math.round(quota.percent_remaining)
  const progressBar = createProgressBar(percentRemaining, width)
  return `${name.padEnd(14)} ${progressBar} ${percentRemaining}% (${used}/${total})`
}

// Public API - exported
export async function getCopilotUsageData(): Promise<CopilotUsageResponse | null> {
  const auth = readAuthConfig()
  const copilotAuth = auth?.["github-copilot"]
  if (!copilotAuth?.refresh) {
    return null
  }
  return fetchCopilotUsage(copilotAuth)
}
```

### API Integration
- **Timeouts:** Always use `fetchWithTimeout` wrapper for network requests (default 10s timeout)
- **Headers:** Build header objects with helper functions (`buildGitHubHeaders`, `buildClaudeHeaders`)
- **Versioning:** Include API version in URLs (`/copilot_internal/v2/token`)
- **User-Agent:** Set appropriate user agent for API requests
- **Response handling:** Always check `response.ok` before parsing JSON
- **Token management:** Support both access and refresh tokens with fallback logic

### Configuration
- **Auth file:** `~/.local/share/opencode/auth.json` (OpenCode standard location)
- **Plugin config:** `opencode.json` for plugin registration
- **Constants:** Define at module level for API URLs, timeouts, headers
- **Environment:** No .env files - read from OpenCode's auth.json
- **Path construction:** Use `path.join()` with `os.homedir()` for cross-platform compatibility

```typescript
const AUTH_CONFIG_PATH = path.join(os.homedir(), ".local", "share", "opencode", "auth.json")
```

### Output Formatting
- **Message sending:** Use `sendIgnoredMessage` for non-interactive responses
- **Progress bars:** `createProgressBar(percent, width)` for visual quota indicators
- **Date/Time:** Use `Date` API for countdown calculations
- **Localization:** Portuguese for user-facing command descriptions

```typescript
// Send formatted message to user
await sendIgnoredMessage(client, sessionID, formattedOutput, params)

// Create progress bar
const progressBar = createProgressBar(percentRemaining, 20) // [##########----------] style
```

## Plugin Registration
Commands registered in `index.ts`:
- Plugin exports a function that returns hook configuration
- Register commands in `config` hook via `opencodeConfig.command["name"]`
- Set `template: ""` for slash commands without parameters
- Set `description` in Portuguese for user-facing help
- Handle command execution in `command.execute.before` hook
- Throw `Error("__COMMAND_HANDLED__")` or similar to prevent default processing

```typescript
export const TestPlugin: Plugin = async ({ client }) => {
  return {
    config: async (opencodeConfig) => {
      opencodeConfig.command ??= {}
      opencodeConfig.command["usage"] = {
        template: "",
        description: "Mostra uso do Copilot e Claude Code",
      }
    },
    "command.execute.before": async (input, output) => {
      if (input.command === "usage") {
        try {
          await handleUsageCommand({ client, sessionID: input.sessionID, params: output })
        } catch (err) {
          console.error(err instanceof Error ? err.message : String(err))
        }
        throw new Error("__USAGE_COMMAND_HANDLED__")
      }
    },
  }
}
```

## Testing
No test framework currently configured. When adding tests:
- Add test runner to devDependencies (e.g., vitest, jest)
- Add test scripts to package.json
- Prefer unit tests for pure functions (`formatQuotaLine`, `createProgressBar`, `getResetCountdown`)
- Integration tests for API calls (use mocked fetch responses)
- Always ensure type checks pass: `npx tsc --noEmit`
