export async function sendIgnoredMessage(
    client: any,
    sessionID: string,
    text: string,
    params: any,
): Promise<void> {
    const agent = params.agent || undefined
    const variant = params.variant || undefined
    const model = params.providerId && params.modelId ? {
        providerID: params.providerId,
        modelID: params.modelId,
    } : undefined

    try {
        await client.session.prompt({
            path: { id: sessionID },
            body: {
                noReply: true,
                agent,
                model,
                variant,
                parts: [{ type: "text", text, ignored: true }],
            },
        })
    } catch (error: any) {
        console.error("Failed to send notification:", error.message)
    }
}
