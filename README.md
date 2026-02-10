# OpenCode Usage Plugin

Track your AI coding assistant usage in one place. This plugin shows both provider quota information and real-time token usage statistics for GitHub Copilot, Claude Code, and Z.ai.

## Table of Contents

> **Note:** This plugin requires [OpenCode](https://opencode.ai) to be installed.

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [What You'll See](#what-youll-see)
- [Features](#features)
- [Configuration Reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## Requirements

Before installing this plugin, make sure you have:

- [OpenCode installed](https://opencode.ai/docs)
- Node.js installed (for local plugin installation)
- API keys/tokens for at least one of the supported services:
  - GitHub Copilot account
  - Anthropic (Claude) API key
  - Z.ai account

## Quick Start

### Step 1: Install OpenCode

If you haven't already, install OpenCode using one of these methods:

```bash
# Quick install (recommended)
curl -fsSL https://opencode.ai/install | bash

# Or using npm
npm install -g opencode-ai

# Or using Homebrew (macOS/Linux)
brew install anomalyco/tap/opencode
```

### Step 2: Install the Usage Plugin

Choose one of the following installation methods:

#### Option A: Install from Local Files

Clone this repository to your project's plugins directory:

```bash
cd /path/to/your/project
mkdir -p .opencode/plugins
git clone https://github.com/toninho09/opencode-usage.git .opencode/plugins/opencode-usage
cd .opencode/plugins/opencode-usage
```

**Tip:** For global installation (available in all projects), use:

```bash
mkdir -p ~/.config/opencode/plugins
git clone https://github.com/toninho09/opencode-usage.git ~/.config/opencode/plugins/opencode-usage
cd ~/.config/opencode/plugins/opencode-usage
npm install
```

#### Option B: Install via npm (coming soon)

```bash
npm install -g @toninho09/opencode-usage@latest
```

Then add to your `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@toninho09/opencode-usage@latest"]
}
```

### Step 3: Run OpenCode and Check Usage

Navigate to your project and start OpenCode:

```bash
cd /path/to/your/project
opencode
```

Now check your usage:

```
/usage
```

## What You'll See

```
╔════════════════════════════════════════════════════════════════════════════════╗
║                                 GITHUB COPILOT                                 ║
╚════════════════════════════════════════════════════════════════════════════════╝
  Plan:            individual
  Premium:         [##                  ] 11% (33/300)
  Chat:            Unlimited
  Completions:     Unlimited
Quota Resets:      18d 0h (2026-02-28 21:00 UTC-03:00)
╔════════════════════════════════════════════════════════════════════════════════╗
║                                  CLAUDE CODE                                   ║
╚════════════════════════════════════════════════════════════════════════════════╝
  5 Hour:          [###                 ] 15%
  7 Day:           [##                  ] 11%
  5h Resets:      4h (2026-02-11 00:59 UTC-03:00)
  7d Resets:      6d 1h (2026-02-16 21:59 UTC-03:00)
  Extra Usage:     Disabled
╔════════════════════════════════════════════════════════════════════════════════╗
║                                Z.AI CODING PLAN                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
  Account:         xxxxxxxx............ (Z.AI Coding Plan)
  Tokens:          [                    ] 1%
  5h Resets:      4h (2026-02-11 00:45 UTC-03:00)
  MCP Searches:    [                    ] 0% (0/100)
╔════════════════════════════════════════════════════════════════════════════════╗
║                                Current Session                                 ║
╚════════════════════════════════════════════════════════════════════════════════╝
  Total Tokens:    14,650
  Messages:        2
  Models:
  ────────────────────────────────────────────────────────────────────────────
  github-copilot/gpt-5-mini
    In: 14,190  Out: 460  Rea: 0  Cache-Rd: 0  Cache-Wr: 0  Messages: 2
╔════════════════════════════════════════════════════════════════════════════════╗
║                           All Sessions (2 sessions)                            ║
╚════════════════════════════════════════════════════════════════════════════════╝
  Total Tokens:    30,332
  Messages:        4
  Models:
  ────────────────────────────────────────────────────────────────────────────
  zai-coding-plan/glm-4.7-flash
    In: 15,102  Out: 492  Rea: 0  Cache-Rd: 88  Cache-Wr: 0  Messages: 2
  github-copilot/gpt-5-mini
    In: 14,190  Out: 460  Rea: 0  Cache-Rd: 0  Cache-Wr: 0  Messages: 2
```

**Token Tracking Key:**
- `In` = Input tokens
- `Out` = Output tokens
- `Rea` = Reasoning tokens
- `Cache-Rd` = Cache read tokens
- `Cache-Wr` = Cache write tokens
- `Messages` = Message count

## Features

- ✅ **Provider quota monitoring**: Shows usage limits and remaining quota for Copilot, Claude, and Z.ai
- ✅ **Real-time token tracking**: Automatically monitors token usage from all AI messages
- ✅ **Provider/Model breakdown**: See usage grouped by AI provider and model
- ✅ **Token type tracking**: Input, output, reasoning, cache read, and cache write tokens
- ✅ **Multi-session support**: View current session and all sessions history
- ✅ **No external dependencies**: Uses only in-memory tracking (reset when app closes)

## License

MIT

## Contributing

Contributions welcome! Feel free to open an issue or pull request.
