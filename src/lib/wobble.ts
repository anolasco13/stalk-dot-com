// Gives each card a small, stable tilt based on its id,
// so cards look hand-placed but don't jump around on every render.
export function wobble(seed: string, maxDegrees: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const unit = (Math.abs(hash) % 1000) / 1000; // 0..1
  return Math.round((unit * 2 - 1) * maxDegrees * 10) / 10;
}

export function pick<T>(seed: string, options: T[]): T {
  let hash = 7;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 17 + seed.charCodeAt(i)) | 0;
  }
  return options[Math.abs(hash) % options.length];
}
