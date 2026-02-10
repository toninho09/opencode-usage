export interface QuotaPeriod {
  utilization: number;
  resets_at: string;
}

export interface ExtraUsage {
  is_enabled: boolean;
  monthly_limit: number | null;
  used_credits: number | null;
  utilization: number | null;
}

export interface ClaudeUsageResponse {
  five_hour: QuotaPeriod | null;
  seven_day: QuotaPeriod | null;
  seven_day_oauth_apps: QuotaPeriod | null;
  seven_day_opus: QuotaPeriod | null;
  seven_day_sonnet: QuotaPeriod | null;
  seven_day_cowork: QuotaPeriod | null;
  iguana_necktie: unknown | null;
  extra_usage: ExtraUsage;
}
