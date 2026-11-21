// Works out where every film and pin goes in the collage.
//
// The collage is a grid of narrow columns and short rows. Pins are packed in first as a
// messy bottom layer; polaroids are then scattered on top in staggered bands, so they
// overlap the pins. Everything is seeded from the items' ids, so the layout stays the
// same on every reload and only shifts when a new film or pin shows up.

export type Spot = {
  col: number; // first grid column (1-based)
  colSpan: number;
  row: number; // first grid row (1-based)
  rowSpan: number;
};

export type Layout = {
  films: Spot[];
  pins: Spot[];
  rows: number; // total grid rows used
};

export type LayoutOptions = {
  cols: number; // grid columns
  zones: number; // how many polaroids sit side by side in a band
  filmSpan: number; // columns a polaroid spans
  filmRows: number; // rows a polaroid roughly covers
  bandRows: number; // rows between one band of polaroids and the next
  pinSpans: number[]; // possible pin widths, in columns
  pinRows: [number, number]; // min and max pin height, in rows
};

export const DESKTOP: LayoutOptions = {
  cols: 12,
  zones: 3,
  filmSpan: 3,
  filmRows: 18,
  bandRows: 27,
  pinSpans: [4, 4, 5, 6],
  pinRows: [9, 14],
};

export const PHONE: LayoutOptions = {
  cols: 6,
  zones: 2,
  filmSpan: 3,
  filmRows: 16,
  bandRows: 27,
  pinSpans: [3, 4, 4, 5],
  pinRows: [7, 11],
};

// A small seeded random number generator (mulberry32).
function seeded(seed: string) {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const choose = <T,>(options: T[]) => options[Math.floor(next() * options.length)];
  return { int, choose };
}

export function layoutCollage(filmIds: string[], pinIds: string[], o: LayoutOptions): Layout {
  // ---------- polaroids: staggered bands across the zones ----------
  const zoneWidth = Math.floor(o.cols / o.zones);
  const stagger = Math.floor(o.bandRows / o.zones);

  const films: Spot[] = filmIds.map((id, i) => {
    const r = seeded(id + o.cols);
    const zone = i % o.zones;
    const band = Math.floor(i / o.zones);
    // Each zone sits a little lower than the one before, so the bands don't read as rows.
    const zoneOffset = ((zone + band) % o.zones) * stagger;
    return {
      col: zone * zoneWidth + 1 + r.int(0, zoneWidth - o.filmSpan),
      colSpan: o.filmSpan,
      row: 1 + band * o.bandRows + zoneOffset + r.int(0, 3),
      rowSpan: o.filmRows,
    };
  });

  const filmBottom = films.length ? Math.max(...films.map((f) => f.row + f.rowSpan)) : 1;

  // ---------- pins: packed onto a skyline, steering clear of polaroids ----------
  const covered = (spot: Spot) => {
    let hidden = 0;
    for (const f of films) {
      const w = Math.min(spot.col + spot.colSpan, f.col + f.colSpan) - Math.max(spot.col, f.col);
      const h = Math.min(spot.row + spot.rowSpan, f.row + f.rowSpan) - Math.max(spot.row, f.row);
      if (w > 0 && h > 0) hidden += w * h;
    }
    return Math.min(1, hidden / (spot.colSpan * spot.rowSpan));
  };

  // Size pins up front so, packed together, they run about as tall as the polaroids.
  const sizes = pinIds.map((id) => {
    const r = seeded(id + o.cols);
    return { colSpan: Math.min(r.choose(o.pinSpans), o.cols), rowSpan: r.int(o.pinRows[0], o.pinRows[1]) };
  });
  const packedHeight = sizes.reduce((sum, p) => sum + p.colSpan * p.rowSpan, 0) / o.cols;
  const grow = packedHeight > 0 ? Math.max(1, (filmBottom - 1) / (packedHeight * 1.45)) : 1;

  const skyline = new Array(o.cols).fill(1); // next free row in each column
  const pins: Spot[] = pinIds.map((id, i) => {
    const r = seeded(id + "spot" + o.cols);
    const { colSpan } = sizes[i];
    const rowSpan = Math.round(sizes[i].rowSpan * grow);

    // Score every column: prefer spots high on the page that a polaroid doesn't cover.
    // A little noise keeps it from lining up.
    let best: Spot = { col: 1, colSpan, row: 1, rowSpan };
    let bestScore = Infinity;
    for (let c = 1; c + colSpan - 1 <= o.cols; c++) {
      const row = Math.max(...skyline.slice(c - 1, c - 1 + colSpan));
      const spot = { col: c, colSpan, row, rowSpan };
      const score = row + covered(spot) * rowSpan * 1.6 + r.int(0, 30) / 10;
      if (score < bestScore) {
        bestScore = score;
        best = spot;
      }
    }

    best.row += r.int(0, 1);
    for (let c = best.col; c < best.col + colSpan; c++) skyline[c - 1] = best.row + rowSpan;
    return best;
  });

  const rows = Math.max(filmBottom, ...pins.map((p) => p.row + p.rowSpan), 1) - 1;
  return { films, pins, rows };
}

// "3 / span 4" for CSS grid-column / grid-row.
export function area(start: number, span: number) {
  return `${start} / span ${span}`;
}
