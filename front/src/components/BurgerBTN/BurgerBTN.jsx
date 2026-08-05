"use client";

import styles from "./BurgerBTN.module.css";

export default function BurgerBTN() {
  return (
    <label className={styles.bar}>
      <input type="checkbox" />

      <span className={`${styles.top} ${styles.line}`}></span>
      <span className={`${styles.middle} ${styles.line}`}></span>
      <span className={`${styles.bottom} ${styles.line}`}></span>
    </label>
  );
}
