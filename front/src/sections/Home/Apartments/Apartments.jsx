"use client";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import React from "react";
import gsap from "gsap";
import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import Image from "next/image";
import Button from "../../../components/Button/Button";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { useSidebarContext } from "@/context/SidebarContext";
import styles from "./Apartments.module.css";

const HIDDEN_STATE = { scale: 0.5, xPercent: 0, opacity: 0, zIndex: 1 };
const SWIPE_THRESHOLD = 50;

const Apartments = ({ data, locale }) => {
  const { setOpenSidebar } = useSidebarContext();
  const [activeCategory, setActiveCategory] = useState(
    data.apartmentCategories[0]?.slug ?? null,
  );
  const [index, setIndex] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const cardsRef = useRef([]);
  const touchStartX = useRef(null);

  const filteredCards = useMemo(
    () =>
      data.apartment_cards.filter((card) => card.category === activeCategory),
    [data.apartment_cards, activeCategory],
  );

  const total = filteredCards.length;

  // Клік на категорію: обидва setState в одному обробнику —
  // React забатчить їх, і не буде проміжного рендеру зі старим index.
  const handleCategoryChange = useCallback((slug) => {
    setActiveCategory(slug);
    setIndex(0);
  }, []);

  useEffect(() => {
    const updateWidth = () => setViewWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const positionsByOffset = useMemo(() => {
    const configs = {
      mobile: {
        "-1": { scale: 0.6, xPercent: -80, opacity: 0.6, zIndex: 3 },
        0: { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        1: { scale: 0.6, xPercent: 80, opacity: 0.6, zIndex: 3 },
      },
      tablet: {
        "-1": { scale: 0.8, xPercent: -70, opacity: 0.6, zIndex: 4 },
        0: { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        1: { scale: 0.8, xPercent: 70, opacity: 0.6, zIndex: 4 },
      },
      desktop: {
        "-1": { scale: 0.8, xPercent: -65, opacity: 0.6, zIndex: 4 },
        0: { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        1: { scale: 0.8, xPercent: 65, opacity: 0.6, zIndex: 4 },
      },
    };
    return viewWidth < 768
      ? configs.mobile
      : viewWidth > 1919
        ? configs.desktop
        : configs.tablet;
  }, [viewWidth]);

  const getOffset = useCallback((i, currentIndex, currentTotal) => {
    let diff = i - currentIndex;
    if (diff > currentTotal / 2) diff -= currentTotal;
    if (diff < -currentTotal / 2) diff += currentTotal;
    return diff;
  }, []);

  // Обрізаємо застарілі рефи синхронно, до анімації.
  useLayoutEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, total);
  }, [total, activeCategory]);

  // useLayoutEffect замість useEffect — виконується ДО малювання кадру,
  // усуває видиме зникнення/блимання карток при зміні категорії.
  useLayoutEffect(() => {
    if (!total) return;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = getOffset(i, index, total);
      const pos = positionsByOffset[offset] ?? HIDDEN_STATE;

      gsap.to(card, {
        scale: pos.scale,
        xPercent: pos.xPercent,
        opacity: pos.opacity,
        duration: 0.6,
        ease: "power2.inOut",
      });
      card.style.zIndex = String(pos.zIndex);
      card.style.pointerEvents = pos.opacity === 0 ? "none" : "auto";
    });
  }, [index, positionsByOffset, getOffset, total, activeCategory]);

  const handleNext = useCallback(() => {
    if (!total) return;
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div className={styles.apartments} id="apartments">
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
        className={styles.blockTitle}
      />
      <div className={styles.titleWrapper}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => <h2 className={styles.title}>{children}</h2>,
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {data.title}
        </ReactMarkdown>
        <Button
          title={data.button.title}
          link
          href={`${locale === "en" ? "/en" : ""}${data.button.href}`}
          small
          icon={data.button.icon.url}
        ></Button>
      </div>
      <div className={styles.categoriesWrapper}>
        {data.apartmentCategories.map((item) => (
          <div
            className={`${styles.category} ${
              item.slug === activeCategory ? styles.categoryActive : ""
            }`}
            key={item.id ?? item.slug}
            onClick={() => handleCategoryChange(item.slug)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className={styles.cardsBackground}>
        <div className={styles.overlay}></div>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.backgroundImage.url}`}
          fill
          sizes="100vw"
          alt="background"
          className={styles.backgroundImage}
        ></Image>
        <div className={styles.carouselWrapper}>
          <div
            className={styles.carousel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.wrapper}>
              {filteredCards.map((card, i) => (
                <div
                  className={styles.card}
                  key={card.documentId ?? card.id}
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                >
                  <div className={styles.cardImageWrapper}>
                    <Image
                      className={styles.image}
                      fill
                      sizes="(max-width: 768px) 90vw, (min-width: 768px) and (max-width: 1023px) 90vw, 45vw"
                      src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${card.image.url}`}
                      alt="main-image"
                    ></Image>
                  </div>
                  <div className={styles.apartmentCharacters}>
                    {card.apartmentCharacters.map((character, idx) => (
                      <div
                        className={`${styles.characterWrapper} ${
                          idx === 0 ? styles.characterFirst : ""
                        }`}
                        key={character.documentId ?? character.id}
                      >
                        <div className={styles.character}>
                          {character.characterTitle}
                        </div>
                        <div className={styles.character}>
                          {character.characterText}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={styles.button}
                    title={card.button}
                    small
                    onClick={() => setOpenSidebar(true)}
                  ></Button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.pagination}>
            <BiChevronsLeft className={styles.nav} onClick={handlePrev} />

            <div className={styles.dotsWrapper}>
              {filteredCards.map((card, i) => (
                <div
                  className={`${styles.dot} ${
                    i === index ? styles.dotActive : ""
                  }`}
                  key={card.documentId ?? card.id}
                  onClick={() => setIndex(i)}
                ></div>
              ))}
            </div>
            <BiChevronsRight className={styles.nav} onClick={handleNext} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apartments;
