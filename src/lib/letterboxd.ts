import { site, isPlaceholder } from "@/config";
import { fetchRssItems, firstImage, text } from "./rss";

export type Film = {
  id: string;
  title: string;
  year: string;
  rating: number | null; // 0.5 to 5
  watchedDate: string; // YYYY-MM-DD
  rewatch: boolean;
  liked: boolean;
  poster: string | null;
  url: string;
};

export async function getRecentFilms(): Promise<Film[]> {
  if (isPlaceholder(site.letterboxdUser)) return [];

  const items = await fetchRssItems(
    `https://letterboxd.com/${encodeURIComponent(site.letterboxdUser)}/rss/`,
  );

  return (
    items
      // The feed also includes lists. Keep only diary entries, which have a film title.
      .filter((item) => text(item["letterboxd:filmTitle"]))
      .slice(0, site.filmCount)
      .map((item) => {
        const rating = text(item["letterboxd:memberRating"]);
        return {
          id: text(item.guid) || text(item.link),
          title: text(item["letterboxd:filmTitle"]),
          year: text(item["letterboxd:filmYear"]),
          rating: rating ? Number(rating) : null,
          watchedDate: text(item["letterboxd:watchedDate"]),
          rewatch: text(item["letterboxd:rewatch"]) === "Yes",
          liked: text(item["letterboxd:memberLike"]) === "Yes",
          poster: firstImage(text(item.description)),
          url: text(item.link),
        };
      })
  );
}

export function stars(rating: number | null): string {
  if (rating == null) return "";
  const whole = Math.floor(rating);
  return "★".repeat(whole) + (rating - whole >= 0.5 ? "½" : "");
}
