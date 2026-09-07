"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import ApartmentsCarousel from "../../../components/ApartmentsCarousel/ApartmentsCarousel";
import styles from "./Apartments.module.css";

const ROOM_TABS = [
  { id: "1", label: "1-кімнатні" },
  { id: "2", label: "2-кімнатні" },
  { id: "3", label: "3-кімнатні" },
];

const APARTMENTS = [1, 2, 3, 4, 5];

export default function Apartments({
  backgroundImage = "/image.png",
  onSelect,
}) {
  const [activeTab, setActiveTab] = useState("1");
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const apartments = APARTMENTS;
  const total = apartments.length;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setActiveIndex(0);
  };

  // useCallback, щоб не створювати нову функцію щорендеру —
  // вона передається в useEffect карусельного onIndexChange
  const handleIndexChange = useCallback((i) => {
    setActiveIndex(i);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Оберіть <span className={styles.titleAccent}>кращий варіант</span> для
          себе
        </h2>
        <button type="button" className={styles.moreButton}>
          Переглянути більше
        </button>
      </div>

      <div className={styles.tabs}>
        {ROOM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <div className={styles.stageBackground}>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className={styles.stageBackgroundImage}
            priority
          />
        </div>

        <ApartmentsCarousel
          ref={carouselRef}
          onIndexChange={handleIndexChange}
        />

        <div className={styles.buttonsWrapper}>
          <button
            type="button"
            className={styles.right}
            onClick={() => carouselRef.current?.prev()}
          >
            left
          </button>

          <div className={styles.dots}>
            {apartments.map((apartment, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
                onClick={() => carouselRef.current?.goTo(index)}
                aria-label={`Перейти до варіанту ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.right}
            onClick={() => carouselRef.current?.next()}
          >
            right
          </button>
        </div>
      </div>
    </section>
  );
}
