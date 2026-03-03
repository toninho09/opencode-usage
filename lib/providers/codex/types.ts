export interface CodexRateLimitWindow {
  used_percent: number;
  limit_window_seconds: number;
  reset_after_seconds: number;
  reset_at: number;
}

export interface CodexRateLimitDetails {
  allowed?: boolean;
  limit_reached?: boolean;
  primary_window?: CodexRateLimitWindow | null;
  secondary_window?: CodexRateLimitWindow | null;
}

export interface CodexCredits {
  has_credits: boolean;
  unlimited: boolean;
  balance?: string | null;
}

export interface CodexAdditionalRateLimit {
  limit_name: string;
  metered_feature: string;
  rate_limit?: CodexRateLimitDetails | null;
}

export interface CodexUsageResponse {
  plan_type: string;
  rate_limit?: CodexRateLimitDetails | null;
  additional_rate_limits?: CodexAdditionalRateLimit[] | null;
  credits?: CodexCredits | null;
}
