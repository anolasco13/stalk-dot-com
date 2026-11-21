import type { Pin } from "@/lib/pinterest";
import { wobble } from "@/lib/wobble";
import styles from "./PinCard.module.css";

// A pin pasted flat onto the page: no border, a little faded, slightly crooked.
export default function PinCard({ pin, style }: { pin: Pin; style: React.CSSProperties }) {
  return (
    <a
      href={pin.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.pin}
      style={
        {
          ...style,
          "--tilt": `${wobble(pin.id, 1.6)}deg`,
          "--dx": `${wobble(pin.id + "x", 10)}px`,
          "--dy": `${wobble(pin.id + "y", 8)}px`,
        } as React.CSSProperties
      }
    >
      <img src={pin.image} alt={pin.title || "a pin from my pinterest"} loading="lazy" />
    </a>
  );
}
