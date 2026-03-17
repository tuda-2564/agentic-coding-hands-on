/**
 * Extracts @mention user IDs from Tiptap-generated HTML.
 *
 * Tiptap serialises mentions as:
 *   <span data-mention-id="<uuid>">@Name</span>
 *
 * This utility parses the `data-mention-id` attribute values,
 * validates that they are safe alphanumeric IDs (UUIDs or slug-style),
 * and returns a deduplicated array.
 *
 * Security: only IDs matching /^[a-zA-Z0-9\-_]{1,128}$/ are returned;
 * this prevents injection via crafted attribute values.
 */

const MENTION_ATTR_REGEX = /data-mention-id="([^"]+)"/g;
const SAFE_ID_REGEX = /^[a-zA-Z0-9\-_]{1,128}$/;

export function extractMentionIds(html: string): string[] {
  if (!html) return [];

  const ids = new Set<string>();
  let match: RegExpExecArray | null;

  MENTION_ATTR_REGEX.lastIndex = 0;
  while ((match = MENTION_ATTR_REGEX.exec(html)) !== null) {
    const id = match[1];
    if (SAFE_ID_REGEX.test(id)) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}
