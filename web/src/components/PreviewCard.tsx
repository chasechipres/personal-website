import styles from "./PreviewCard.module.css";

type Props = {
  title: string;
  description: string;
  badge: string;
  previewLabel: string;
};

// A "coming soon" card (DESIGN.md): not a link, no hover, and a wireframe
// drawn as plain shapes. No numbers, so nothing reads as real results.
export default function PreviewCard({ title, description, badge, previewLabel }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <span className={styles.badge}>{badge}</span>
        <svg className={styles.wireframe} viewBox="0 0 320 200" role="img" aria-label={previewLabel}>
          <rect x="16" y="16" width="88" height="36" rx="6" />
          <rect x="116" y="16" width="88" height="36" rx="6" />
          <rect x="216" y="16" width="88" height="36" rx="6" />
          <polyline
            className={styles.line}
            points="16,120 56,108 96,114 136,92 176,98 216,76 256,82 304,64"
          />
          <rect x="16" y="140" width="288" height="10" rx="3" />
          <rect x="16" y="158" width="288" height="10" rx="3" />
          <rect x="16" y="176" width="200" height="10" rx="3" />
        </svg>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
