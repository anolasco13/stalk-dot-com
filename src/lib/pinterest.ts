import { site, isPlaceholder } from "@/config";
import { fetchRssItems, firstImage, text } from "./rss";

export type Pin = {
  id: string;
  title: string;
  image: string;
  url: string;
  date: string;
};

export async function getRecentPins(): Promise<Pin[]> {
  if (isPlaceholder(site.pinterestUser)) return [];

  const user = encodeURIComponent(site.pinterestUser);
  const feedUrl = site.pinterestBoard
    ? `https://www.pinterest.com/${user}/${encodeURIComponent(site.pinterestBoard)}.rss`
    : `https://www.pinterest.com/${user}/feed.rss`;

  const items = await fetchRssItems(feedUrl);
  const pins: Pin[] = [];

  for (const item of items) {
    const image = firstImage(text(item.description));
    if (!image) continue;
    pins.push({
      id: text(item.guid) || text(item.link),
      title: text(item.title),
      // The feed links a small 236px thumbnail; ask for the 736px version instead.
      image: image.replace("/236x/", "/736x/"),
      url: text(item.link),
      date: text(item.pubDate),
    });
    if (pins.length >= site.pinCount) break;
  }

  return pins;
}
