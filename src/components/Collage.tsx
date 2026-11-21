import type { Film } from "@/lib/letterboxd";
import type { Pin } from "@/lib/pinterest";
import { area, DESKTOP, layoutCollage, PHONE } from "@/lib/collage";
import { pick } from "@/lib/wobble";
import FilmCard from "./FilmCard";
import PinCard from "./PinCard";
import styles from "./Collage.module.css";

// Pins pasted down as a faded bottom layer, polaroids scattered over the top.
// Desktop and phone each get their own layout; CSS switches between them.
export default function Collage({ films, pins }: { films: Film[]; pins: Pin[] }) {
  const filmIds = films.map((f) => f.id);
  const pinIds = pins.map((p) => p.id);
  const big = layoutCollage(filmIds, pinIds, DESKTOP);
  const small = layoutCollage(filmIds, pinIds, PHONE);

  return (
    <div
      className={styles.collage}
      style={{ "--rows": big.rows, "--rows-sm": small.rows } as React.CSSProperties}
    >
      {films.map((film, i) => (
        <div
          key={film.id}
          className={styles.film}
          style={
            {
              "--col": area(big.films[i].col, big.films[i].colSpan),
              "--row": area(big.films[i].row, big.films[i].rowSpan),
              "--col-sm": area(small.films[i].col, small.films[i].colSpan),
              "--row-sm": area(small.films[i].row, small.films[i].rowSpan),
              "--justify": pick(film.id, ["start", "center", "end"]),
            } as React.CSSProperties
          }
        >
          <FilmCard film={film} index={i} />
        </div>
      ))}

      {pins.map((pin, i) => (
        <PinCard
          key={pin.id}
          pin={pin}
          style={
            {
              "--col": area(big.pins[i].col, big.pins[i].colSpan),
              "--row": area(big.pins[i].row, big.pins[i].rowSpan),
              "--col-sm": area(small.pins[i].col, small.pins[i].colSpan),
              "--row-sm": area(small.pins[i].row, small.pins[i].rowSpan),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
