import { wobble } from "@/lib/wobble";
import styles from "./Tape.module.css";

// A strip of torn black tape. `seed` keeps its angle the same on every render.
export default function Tape({ seed, className = "" }: { seed: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className ? `${styles.tape} ${className}` : styles.tape}
      style={{ "--tape-tilt": `${wobble(seed + "tape", 9)}deg` } as React.CSSProperties}
    />
  );
}
