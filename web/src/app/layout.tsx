import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { profileLinks } from "@/content/links";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chase Chipres",
  description:
    "iOS developer turned backend developer, using AI to build a little bit of everything.",
};

// Applies a saved theme before first paint so dark-mode visitors never see a light flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className={styles.nav}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.name}>
              Chase Chipres
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {children}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <ul className={styles.footerLinks}>
              {profileLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} {...link.external}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.meta}>
              Built with Next.js, served from Oracle Cloud. © {new Date().getFullYear()} Chase Chipres
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
