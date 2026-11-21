import type { Film } from "@/lib/letterboxd";
import { stars } from "@/lib/letterboxd";
import { pick, wobble } from "@/lib/wobble";
import Tape from "./Tape";
import styles from "./FilmCard.module.css";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "2025-11-14" -> "nov 14". Parsed by hand so the server's time zone can't shift the day.
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  if (!m || !d) return "";
  return `${MONTHS[m - 1]} ${d}`;
}

export default function FilmCard({ film, index }: { film: Film; index: number }) {
  // Most cards are taped down; a few are pinned instead.
  const fastener = pick(film.id, ["tape", "tape", "tape", "pin"]);
  const date = shortDate(film.watchedDate);
  // Neighbours lean opposite ways (1° to 3.5°), so the row looks hand-placed.
  const tilt = (index % 2 === 0 ? -1 : 1) * (1 + Math.abs(wobble(film.id, 2.5)));

  return (
    <a
      href={film.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{ "--tilt": `${tilt.toFixed(1)}deg` } as React.CSSProperties}
    >
      {fastener === "tape" ? <Tape seed={film.id} /> : <span className={styles.pin} aria-hidden="true" />}

      <div className={styles.photo}>
        {film.poster ? (
          <img src={film.poster} alt={`Poster for ${film.title}`} loading="lazy" />
        ) : (
          <span className={styles.noPoster}>no poster</span>
        )}
      </div>

      <div className={styles.caption}>
        <p className={styles.title}>
          {film.title} {film.year && <span className={styles.year}>({film.year})</span>}
        </p>
        <p className={styles.meta}>
          {film.rating != null && (
            <span className={styles.stars} aria-label={`${film.rating} out of 5 stars`}>
              {stars(film.rating)}
            </span>
          )}
          {film.liked && (
            <span className={styles.heart} aria-label="liked">
              ♥
            </span>
          )}
          {film.rewatch && (
            <span className={styles.rewatch} aria-label="rewatch">
              ↻
            </span>
          )}
          {date && <span className={styles.date}>{date}</span>}
        </p>
      </div>
    </a>
  );
}
