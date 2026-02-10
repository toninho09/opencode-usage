import { formatResetLine, formatTokens, maskApiKey } from "../../shared/formatting";
import { createUsedProgressBar } from "../../shared/utils";
import type { ZaiUsageResponse, UsageLimitItem } from "./types";

export class ZaiFormatter {
  /**
   * Calculates usage display based on available fields from API
   */
  private calculateUsageDisplay(limit: UsageLimitItem): string {
    const { usage, currentValue, remaining } = limit;

    // Case 1: API returns usage and currentValue (when already used)
    if (currentValue !== undefined && usage !== undefined) {
      return ` (${formatTokens(currentValue)}/${formatTokens(usage)})`;
    }

    // Case 2: API returns remaining and usage (calculate currentValue)
    if (remaining !== undefined && usage !== undefined) {
      const used = usage - remaining;
      return ` (${formatTokens(used)}/${formatTokens(usage)})`;
    }

    // Case 3: Only remaining available
    if (remaining !== undefined) {
      return ` (0/${formatTokens(remaining)})`;
    }

    return "";
  }

  /**
   * Formats Z.ai usage data for display
   */
  format(data: ZaiUsageResponse, apiKey: string): string {
    const lines: string[] = [];
    const limits = data.data.limits;

    const maskedKey = maskApiKey(apiKey);
    lines.push("╔════════════════════════════════════════╗");
    lines.push("║       Z.AI CODING PLAN                 ║");
    lines.push("╚════════════════════════════════════════╝");
    lines.push(`Account:         ${maskedKey} (Z.AI Coding Plan)`);

    if (!limits || limits.length === 0) {
      lines.push("No quota data available");
      return lines.join("\n");
    }

    const tokensLimit = limits.find((l) => l.type === "TOKENS_LIMIT");
    if (tokensLimit) {
      const percentUsed = tokensLimit.percentage;
      const progressBar = createUsedProgressBar(percentUsed, 20);
      const usageDisplay = this.calculateUsageDisplay(tokensLimit);

      lines.push(`Tokens:          ${progressBar} ${percentUsed}%${usageDisplay}`);

      if (tokensLimit.nextResetTime) {
        lines.push(formatResetLine("5h Resets:", tokensLimit.nextResetTime, 16));
      }
    }

    const timeLimit = limits.find((l) => l.type === "TIME_LIMIT");
    if (timeLimit) {
      const percentUsed = timeLimit.percentage;
      const progressBar = createUsedProgressBar(percentUsed, 20);

      const currentValue = timeLimit.currentValue ?? 0;
      const total = timeLimit.usage ?? (timeLimit.remaining ?? 0);

      lines.push(
        `MCP Searches:    ${progressBar} ${percentUsed}% (${currentValue}/${total})`,
      );
    }

    return lines.join("\n");
  }
}
