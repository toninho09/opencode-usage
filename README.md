# OpenCode Usage Plugin

Track your AI coding assistant usage in one place. This plugin shows quota information and usage statistics for GitHub Copilot, Claude Code, and Z.ai with a single command.

## Table of Contents

> **Note:** This plugin requires [OpenCode](https://opencode.ai) to be installed.

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
git clone https://github.com/yourusername/opencode-usage.git .opencode/plugins/opencode-usage
cd .opencode/plugins/opencode-usage
npm install
```

**Tip:** For global installation (available in all projects), use:

```bash
mkdir -p ~/.config/opencode/plugins
git clone https://github.com/yourusername/opencode-usage.git ~/.config/opencode/plugins/opencode-usage
cd ~/.config/opencode/plugins/opencode-usage
npm install
```

#### Option B: Install via npm (coming soon)

```bash
npm install -g opencode-usage
```

Then add to your `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-usage"]
}
```

### Step 3: Configure Your AI Services

Add your API credentials to OpenCode's auth file:

```bash
# Edit the auth file
nano ~/.local/share/opencode/auth.json
```

Add your credentials:

```json
{
  "github-copilot": {
    "refresh": "your_copilot_refresh_token"
  },
  "anthropic": {
    "access": "your_anthropic_api_key"
  },
  "zai": {
    "access": "your_zai_api_key",
    "refresh": "your_zai_refresh_token"
  }
}
```

**Where to find your tokens:**

- **GitHub Copilot**: Sign in with `/connect` command in OpenCode and select GitHub, or manually add your refresh token
- **Claude Code**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
- **Z.ai**: Get your API keys from [Z.ai Dashboard](https://z.ai)

**Easier GitHub Copilot Setup:**

Run this command in OpenCode instead of manually adding the token:

```
/connect
```

Select "GitHub Copilot" and follow the prompts. OpenCode will automatically configure your credentials.

### Step 4: Run OpenCode and Check Usage

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
GitHub Copilot
  Code Completion  [###########-------] 70% (7000/10000)
  Inline Chat      [###########-------] 70% (3500/5000)

Claude Code
  API Requests     [##########--------] 60% (60000/100000)

Z.ai
  Total Requests   [#########---------] 50% (5000/10000)
```

## Features

- **Multi-provider support**: Track GitHub Copilot, Claude Code, and Z.ai
- **One command**: View all usage with `/usage`
- **Visual progress bars**: See your quota at a glance
- **Auto-detection**: Automatically finds your configured services
- **Privacy-friendly**: Only reads your auth file, no data sent elsewhere

## Configuration Reference

### GitHub Copilot

```json
{
  "github-copilot": {
    "refresh": "your_oauth_refresh_token"
  }
}
```

### Claude Code (Anthropic)

```json
{
  "anthropic": {
    "access": "your_api_key"
  }
}
```

### Z.ai

```json
{
  "zai": {
    "access": "your_api_key",
    "refresh": "your_refresh_token"
  }
}
```

## Troubleshooting

### No usage data shown

**Problem:** Running `/usage` shows "No usage service configured."

**Solution:** Check your auth file:
```bash
cat ~/.local/share/opencode/auth.json
```
Make sure it contains valid credentials for at least one service.

### Plugin not loading

**Problem:** The `/usage` command is not recognized.

**Solutions:**
- If using local files, verify the directory exists:
  ```bash
  ls -la .opencode/plugins/opencode-usage
  # or for global
  ls -la ~/.config/opencode/plugins/opencode-usage
  ```
- If using npm, verify the package name in `opencode.json` is correct
- Restart OpenCode after installation
- Check that dependencies are installed in the plugin directory:
  ```bash
  cd .opencode/plugins/opencode-usage
  npm install
  ```

### "Access denied" or "Unauthorized" errors

**Problem:** Plugin shows authentication errors when fetching data.

**Solution:** Your tokens may be expired or invalid. Re-authenticate:
- GitHub Copilot: Run `/connect` in OpenCode and select GitHub
- Claude Code: Generate a new API key from the Anthropic Console
- Z.ai: Generate new API keys from the Z.ai Dashboard

### Permission errors on auth file

**Problem:** "Permission denied" when accessing auth file.

**Solution:** Ensure correct file permissions:
```bash
chmod 600 ~/.local/share/opencode/auth.json
chown $USER:$(id -gn) ~/.local/share/opencode/auth.json
```

### Type checking errors (development)

**Problem:** TypeScript type checking fails.

**Solution:**
```bash
cd .opencode/plugins/opencode-usage
npm install
npx tsc --noEmit
```

## Development

Run type checking:

```bash
npx tsc --noEmit
```

## License

MIT

## Contributing

Contributions welcome! Feel free to open an issue or pull request.
