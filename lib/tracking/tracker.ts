import { state, SessionUsage, TokenMetrics } from "./types";

const logToApp = async (level: "debug" | "info" | "warn", message: string, extra?: Record<string, any>) => {
  try {
    const client = await (window as any).__opencodeClient
    if (client?.app?.log) {
      await client.app.log({
        body: {
          service: "tracking-plugin",
          level,
          message,
          extra,
        },
      })
    }
  } catch {
  }
}

export function getCurrentSession(): SessionUsage | null {
  if (!state.currentSessionID) {
    return null;
  }
  return getSession(state.currentSessionID);
}

export function getSession(sessionID: string): SessionUsage {
  if (!state.sessions.has(sessionID)) {
    logToApp("info", "Creating new session", { sessionID })
    state.sessions.set(sessionID, {
      sessionID,
      total: { input: 0, output: 0, reasoning: 0, cacheRead: 0, cacheWrite: 0 },
      byModel: new Map(),
    });
  } else {
    logToApp("debug", "Session found", { sessionID })
  }
  return state.sessions.get(sessionID)!;
}

export function updateSession(sessionID: string, sessionData: Partial<SessionUsage>): void {
  const session = getSession(sessionID);
  logToApp("debug", "Updating session", { sessionID, sessionData })
  Object.assign(session, sessionData);
}

export function addTokens(
  sessionID: string,
  provider: string,
  model: string,
  tokens: TokenMetrics,
): void {
  logToApp("debug", "Adding tokens", { sessionID, provider, model, tokens })
  
  const session = getSession(sessionID);

  session.total.input += tokens.input;
  session.total.output += tokens.output;
  session.total.reasoning += tokens.reasoning;
  session.total.cacheRead += tokens.cacheRead;
  session.total.cacheWrite += tokens.cacheWrite;

  const key = `${provider}/${model}`;
  let modelStats = session.byModel.get(key);
  if (!modelStats) {
    logToApp("info", "Creating new model stats", { key })
    modelStats = {
      provider,
      model,
      metrics: { input: 0, output: 0, reasoning: 0, cacheRead: 0, cacheWrite: 0 },
      messageCount: 0,
    };
    session.byModel.set(key, modelStats);
  }
  modelStats.metrics.input += tokens.input;
  modelStats.metrics.output += tokens.output;
  modelStats.metrics.reasoning += tokens.reasoning;
  modelStats.metrics.cacheRead += tokens.cacheRead;
  modelStats.metrics.cacheWrite += tokens.cacheWrite;
  modelStats.messageCount++;
  
  logToApp("debug", "Tokens updated", { totalInput: session.total.input, totalOutput: session.total.output })
}

export function getAllSessions(): SessionUsage[] {
  const sessions = Array.from(state.sessions.values());
  logToApp("debug", "Returning total sessions", { count: sessions.length })
  return sessions;
}
