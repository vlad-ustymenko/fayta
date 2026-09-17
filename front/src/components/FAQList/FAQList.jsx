"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styles from "./FAQList.module.css";
import { BiChevronsDown } from "react-icons/bi";

const FAQList = ({ data }) => {
  const [activeId, setActiveId] = useState(data[0].id);
  const toggleTab = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };
  return (
    <div className={styles.faq} id="faq">
      <div>
        {data.map((item) => (
          <div
            key={item.id}
            className={styles.tabWrapper}
            onClick={() => toggleTab(item.id)}
          >
            <div className={styles.tabTitleWrapper}>
              <p
                className={`${styles.tabTitle} ${
                  activeId === item.id ? styles.activeTab : ""
                }`}
              >
                {item.title}
              </p>

              <div className={styles.iconWrapper}>
                <BiChevronsDown
                  className={
                    activeId === item.id
                      ? `${styles.icon} ${styles.rotate}`
                      : styles.icon
                  }
                />
              </div>
            </div>

            <div
              className={`${styles.tabDescription} ${
                activeId === item.id ? styles.open : ""
              }`}
            >
              <p className={styles.tabContent}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQList;
