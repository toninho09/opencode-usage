export interface UsageLimitItem {
  type: "TIME_LIMIT" | "TOKENS_LIMIT";
  usage?: number;
  currentValue?: number;
  remaining?: number;
  percentage: number;
  nextResetTime?: number;
  unit?: number;
  number?: number;
  usageDetails?: Array<{
    modelCode: string;
    usage: number;
  }>;
}

export interface ZaiUsageResponse {
  code: number;
  msg: string;
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}
