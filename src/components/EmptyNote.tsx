import styles from "./EmptyNote.module.css";

// Shown when a feed is empty or couldn't be loaded.
export default function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.note} role="status">
      <p>{children}</p>
    </div>
  );
}
