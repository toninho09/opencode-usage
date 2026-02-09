import type { Plugin } from "@opencode-ai/plugin"

export const TestPlugin: Plugin = async ({client, $}) => {
    return {
        "command.execute.before": async (input, _output) => {
            // if (input.command === "usage") {
                console.log("Executing usage command")
            // }
        },
        config: async (opencodeConfig) => {
            opencodeConfig.command ??= {}
            opencodeConfig.command["usage"] = {
                template: "",
                description: "Show available DCP commands",
            }
        }
    }
}

export default TestPlugin
