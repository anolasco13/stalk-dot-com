import { site } from "@/config";
import { getRecentFilms } from "@/lib/letterboxd";
import { getRecentPins } from "@/lib/pinterest";
import Collage from "@/components/Collage";
import EmptyNote from "@/components/EmptyNote";
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

      <section className={styles.section} aria-labelledby="lately">
        <div className={styles.sectionHead}>
          <h2 id="lately" className={styles.sectionTitle}>
            lately
          </h2>
          <span className={styles.sectionNote}>films via letterboxd · pins via pinterest</span>
        </div>

        {films.length + pins.length > 0 ? (
          <Collage films={films} pins={pins} />
        ) : (
          <EmptyNote>nothing here yet… check back after the next movie night.</EmptyNote>
        )}
      </section>

      <footer className={styles.footer}>
        <p>✝ pasted together by hand ✝</p>
      </footer>
    </main>
  );
}
