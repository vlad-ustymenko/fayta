// BurgerBTN.jsx
"use client";

import styles from "./BurgerBTN.module.css";

export default function BurgerBTN({ checked, onClick }) {
  return (
    <label className={styles.bar}>
      <input type="checkbox" checked={checked} onChange={onClick} />
      <span className={`${styles.top} ${styles.line}`}></span>
      <span className={`${styles.middle} ${styles.line}`}></span>
      <span className={`${styles.bottom} ${styles.line}`}></span>
    </label>
  );
}
