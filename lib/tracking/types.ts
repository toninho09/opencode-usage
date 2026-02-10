export interface TokenMetrics {
  input: number;
  output: number;
  reasoning: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface ModelStats {
  provider: string;
  model: string;
  metrics: TokenMetrics;
  messageCount: number;
}

export interface SessionUsage {
  sessionID: string;
  total: TokenMetrics;
  byModel: Map<string, ModelStats>;
}

export interface UsageState {
  sessions: Map<string, SessionUsage>;
  currentSessionID: string | null;
}

export const state: UsageState = {
  sessions: new Map(),
  currentSessionID: null,
};
