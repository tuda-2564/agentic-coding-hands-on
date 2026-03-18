export function formatVND(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("en-US")} VND`;
}

export function formatHeartCount(count: number): string {
  return count.toLocaleString("en-US");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function formatKudoTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes} - ${month}/${day}/${year}`;
}
