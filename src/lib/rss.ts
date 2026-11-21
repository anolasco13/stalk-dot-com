import { XMLParser } from "fast-xml-parser";
import { site } from "@/config";

export type RssItem = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  // Keep every value as a string, so a film called "1917" stays text.
  parseTagValue: false,
  htmlEntities: true,
});

// Fetches an RSS feed on the server and returns its items.
// Returns [] if anything goes wrong, so the page can show an empty state instead of crashing.
export async function fetchRssItems(url: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; stalk-dot-com personal site)" },
      next: { revalidate: site.refreshSeconds },
    });
    if (!res.ok) return [];
    const data = parser.parse(await res.text());
    const items = data?.rss?.channel?.item;
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  } catch {
    return [];
  }
}

// Reads a tag's text, whether the parser gave a plain string or an object with attributes.
export function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object" && "#text" in value) {
    return String((value as { "#text": unknown })["#text"]).trim();
  }
  return String(value).trim();
}

// Pulls the first <img src="..."> out of an HTML snippet.
export function firstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}
