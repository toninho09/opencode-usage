import { formatFriendlyDate } from "./utils";

/**
 * Formats a countdown line for quota reset
 * Accepts both ISO string and timestamp in milliseconds
 */
export function formatResetCountdown(resetDate: string | number | undefined): string {
  if (!resetDate) {
    return "N/A";
  }

  const reset = new Date(resetDate);
  const now = new Date();
  const diffMs = reset.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Resets soon";
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
}

/**
 * Formats a complete reset line with friendly date
 */
export function formatResetLine(
  label: string,
  resetDate: string | number | undefined,
  labelWidth: number = 15,
): string {
  if (!resetDate) {
    return `${label.padEnd(labelWidth)} N/A`;
  }

  const countdown = formatResetCountdown(resetDate);
  const friendlyDate = formatFriendlyDate(resetDate);

  return `${label.padEnd(labelWidth)} ${countdown} (${friendlyDate})`;
}

/**
 * Formats large numbers as tokens (1000 -> 1K, 1000000 -> 1M)
 */
export function formatTokens(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

/**
 * Masks an API key showing only the first 8 characters
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return apiKey;
  }
  return apiKey.substring(0, 8) + "............";
}
