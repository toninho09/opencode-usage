import { formatResetLine } from "../../shared/formatting";
import { createUsedProgressBar, boxHeader } from "../../shared/utils";
import type { ClaudeUsageResponse, QuotaPeriod } from "./types";

export class ClaudeFormatter {
  /**
   * Formats a Claude quota line with progress bar
   */
  private formatQuotaLine(name: string, quota: QuotaPeriod | null): string {
    if (!quota) {
      return `  ${name.padEnd(16)} N/A`;
    }

    const percentUsed = Math.round(quota.utilization);
    const progressBar = createUsedProgressBar(percentUsed, 20);

    return `  ${name.padEnd(16)} ${progressBar} ${percentUsed}%`;
  }

  /**
   * Formats Claude usage data for display
   */
  format(data: ClaudeUsageResponse): string {
    const lines: string[] = [];

    lines.push(boxHeader("CLAUDE CODE", 80));

    lines.push(this.formatQuotaLine("5 Hour:", data.five_hour));
    lines.push(this.formatQuotaLine("7 Day:", data.seven_day));

    if (data.five_hour) {
      lines.push("  " + formatResetLine("5h Resets:", data.five_hour.resets_at, 15));
    }

    if (data.seven_day) {
      lines.push("  " + formatResetLine("7d Resets:", data.seven_day.resets_at, 15));
    }

    const extraUsage = data.extra_usage;
    if (extraUsage.is_enabled) {
      const utilization =
        extraUsage.utilization !== null ? `${Math.round(extraUsage.utilization)}%` : "N/A";
      const credits =
        extraUsage.used_credits !== null && extraUsage.monthly_limit !== null
          ? `${extraUsage.used_credits}/${extraUsage.monthly_limit}`
          : "N/A";
      lines.push(`  Extra Usage:     Enabled - ${utilization} (${credits})`);
    } else {
      lines.push("  Extra Usage:     Disabled");
    }

    return lines.join("\n");
  }
}
