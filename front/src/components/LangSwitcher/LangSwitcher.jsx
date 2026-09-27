"use client";
import { useParams } from "next/navigation";
import styles from "./LangSwitcher.module.css";
import React from "react";

const LangSwitcher = ({ className }) => {
  const { locale } = useParams();
  return (
    <a
      href={locale === "en" ? `/` : `/en`}
      className={`${styles.langSwitcher} ${className}`}
      aria-label={
        locale === "en" ? "Перемкнути на українську" : "Switch to English"
      }
    >
      {locale === "en" ? <div>UA</div> : <div>EN</div>}
    </a>
  );
};

export default LangSwitcher;
