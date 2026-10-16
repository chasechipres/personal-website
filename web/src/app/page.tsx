import Image from "next/image";
import PreviewCard from "@/components/PreviewCard";
import { profileLinks } from "@/content/links";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Chase Chipres</h1>
          <p className={styles.lead}>From iOS apps to backend systems.</p>
          <p className={styles.body}>
            I use AI to build a little bit of everything. Lately, that&apos;s a 24/7 agentic trading
            bot and the live dashboard behind this site.
          </p>
          <p className={styles.location}>Seattle, WA · SoCal born and raised</p>
          <ul className={styles.links}>
            {profileLinks.map((link) => (
              <li key={link.label}>
                <a className={styles.pill} href={link.href} {...link.external}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Image
          className={styles.photo}
          src="/hero.jpg"
          alt="Rooftop selfie at sunset above the Seattle skyline"
          width={1600}
          height={1200}
          priority
        />
      </section>

      <section className={styles.projects} aria-labelledby="projects-title">
        <h2 id="projects-title" className={styles.sectionTitle}>
          Projects
        </h2>
        <div className={styles.grid}>
          <PreviewCard
            title="rh-gex-trader"
            description="An options-trading bot that sizes and times trades from dealer gamma exposure, with hard risk guardrails."
            badge="Live dashboard — coming soon"
            previewLabel="Preview of the upcoming live trading dashboard"
          />
        </div>
      </section>
    </main>
  );
}
