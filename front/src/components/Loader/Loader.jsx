import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ title }) => {
  return (
    <div className={styles.loader}>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>
      <div className={styles.text}>
        <span>{title}</span>
      </div>

      <div className={styles.line}></div>
    </div>
  );
};

export default Loader;
