export async function sendIgnoredMessage(
    client: any,
    sessionID: string,
    text: string,
): Promise<void> {
    try {
        await client.session.prompt({
            path: { id: sessionID },
            body: {
                noReply: true,
                parts: [{ type: "text", text, ignored: true }],
            },
        })
    } catch (error: any) {
        console.error("Failed to send notification:", error.message)
    }
}
