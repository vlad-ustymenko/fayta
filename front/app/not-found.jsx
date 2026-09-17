"use client";
import styles from "./not-found.module.css";
import { usePathname } from "next/navigation";
import Button from "@/src/components/Button/Button";
import "../app/globals.css";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        {locale === "en" ? "So sorry! " : "Вибачте!"}
      </h1>
      <h2 className={styles.subtitle}>
        {locale === "en"
          ? "The page you're looking for cannot be found"
          : "Сторінку, яку ви шукаєте, не знайдено"}
      </h2>
      <p className={styles.textTitle}>
        {locale === "en" ? "Possible reasons:" : "Можливі причини:"}
      </p>
      <p className={styles.text}>
        {locale === "en"
          ? "The link was entered incorrectly."
          : "Посилання було введено неправильно."}
      </p>
      <p className={styles.text}>
        {locale === "en"
          ? "The link is broken or outdated."
          : "Посилання не працює або є застарілим."}
      </p>
      <p className={styles.text}>
        {locale === "en"
          ? "The site is temporarily unavailable."
          : "Сайт тимчасово недоступний."}
      </p>

      <Button
        title={locale === "en" ? "Main" : "Головна"}
        primary
        link
        href={`/`}
      />
    </main>
  );
}
