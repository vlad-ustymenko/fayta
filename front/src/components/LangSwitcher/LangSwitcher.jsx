"use client";
import { useParams } from "next/navigation";
import styles from "./LangSwitcher.module.css";
import React from "react";

const LangSwitcher = () => {
  const { locale } = useParams();
  return (
    <a
      href={locale === "en" ? `/uk` : `/en`}
      className={styles.langSwitcher}
      aria-label={
        locale === "en" ? "Перемкнути на українську" : "Switch to English"
      }
    >
      {locale === "uk" ? <div>EN</div> : <div>UK</div>}
    </a>
  );
};

export default LangSwitcher;
