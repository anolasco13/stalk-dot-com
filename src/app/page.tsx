import { site } from "@/config";
import { getRecentFilms } from "@/lib/letterboxd";
import { getRecentPins } from "@/lib/pinterest";
import styles from "./page.module.css";

export default async function Home() {
  const [films, pins] = await Promise.all([getRecentFilms(), getRecentPins()]);

  return (
    <main className="page">
      <header className={styles.header}>
        <h1 className={`${styles.name} ink`}>{site.name}</h1>
        <p className={styles.tagline}>{site.tagline}</p>
        <div className={styles.rule} aria-hidden="true" />
      </header>

      <section className={styles.section} aria-labelledby="watched">
        <div className={styles.sectionHead}>
          <h2 id="watched" className={styles.sectionTitle}>
            recently watched
          </h2>
          <span className={styles.sectionNote}>via letterboxd</span>
        </div>
        {/* Film cards arrive in the next chunk. */}
        <p className={styles.placeholder}>{films.length} films found.</p>
      </section>

      <section className={styles.section} aria-labelledby="pinned">
        <div className={styles.sectionHead}>
          <h2 id="pinned" className={styles.sectionTitle}>
            recently pinned
          </h2>
          <span className={styles.sectionNote}>via pinterest</span>
        </div>
        {/* Pin collage arrives after that. */}
        <p className={styles.placeholder}>{pins.length} pins found.</p>
      </section>

      <footer className={styles.footer}>
        <p>✝ pasted together by hand ✝</p>
      </footer>
    </main>
  );
}
