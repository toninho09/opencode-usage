export async function fetchWithTimeout(
  url: string | URL | Request,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const timeout = options.timeout ?? 10000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createUsedProgressBar(percentUsed: number, width: number = 20): string {
  const filled = Math.round((percentUsed / 100) * width);
  const empty = width - filled;
  return "[" + "#".repeat(filled) + " ".repeat(empty) + "]";
}

export function formatFriendlyDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const timezone = `UTC${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`;
  
  return `${year}-${month}-${day} ${hours}:${minutes} ${timezone}`;
}

/**
 * Creates a centered box header with title
 * Width is the inner content width (excludes the border characters)
 * Example with width=80:
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                  MY TITLE                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */
export function boxHeader(title: string, width: number = 80): string {
  const topLine = "╔" + "═".repeat(width) + "╗";
  const bottomLine = "╚" + "═".repeat(width) + "╝";
  
  // Center the title within the width
  const padding = Math.max(0, width - title.length);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  const centerTitle = " ".repeat(leftPad) + title + " ".repeat(rightPad);
  
  const middleLine = "║" + centerTitle + "║";
  
  return topLine + "\n" + middleLine + "\n" + bottomLine;
}
