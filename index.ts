import type { Plugin } from "@opencode-ai/plugin"
import { handleUsageCommand } from "./lib/usage-handler"

export const TestPlugin: Plugin = async ({ client }) => {
    return {
        config: async (opencodeConfig) => {
            opencodeConfig.command ??= {}
            opencodeConfig.command["usage"] = {
                template: "",
                description: "Shows usage for Copilot, Claude Code and Z.ai",
            }
        },
        "command.execute.before": async (input, output) => {
            if (input.command === "usage") {
                try {
                    await handleUsageCommand({
                        client,
                        sessionID: input.sessionID,
                        params: output,
                    })
                } catch (err) {
                    console.error(err instanceof Error ? err.message : String(err))
                }

                throw new Error("__USAGE_COMMAND_HANDLED__")
            }
        },
    }
}

export default TestPlugin
