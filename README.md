# OpenCode Usage Plugin

Track your AI coding assistant usage in one place. This plugin shows quota information and usage statistics for GitHub Copilot, Claude Code, and Z.ai with a single command.

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
╔════════════════════════════════════════╗
║         GITHUB COPILOT                 ║
╚════════════════════════════════════════╝
Plan:            individual
Premium:         [##                  ] 11% (33/300)
Chat:            Unlimited
Completions:     Unlimited
Quota Resets:    18d 20h (9999-12-31 23:59 UTC-03:00)
╔════════════════════════════════════════╗
║       CLAUDE CODE                      ║
╚════════════════════════════════════════╝
5 Hour:          [################### ] 94%
7 Day:           [#                   ] 7%
5h Resets:       2h (9999-12-31 23:59 UTC-03:00)
7d Resets:       6d 21h (9999-12-31 23:59 UTC-03:00)
Extra Usage:     Disabled
╔════════════════════════════════════════╗
║       Z.AI CODING PLAN                 ║
╚════════════════════════════════════════╝
Account:         xxxxxxxx............ (Z.AI Coding Plan)
Tokens:          [#                   ] 4%
5h Resets:       3h (9999-12-31 23:59 UTC-03:00)
MCP Searches:    [                    ] 0% (0/100)
```

## License

MIT

## Contributing

Contributions welcome! Feel free to open an issue or pull request.
