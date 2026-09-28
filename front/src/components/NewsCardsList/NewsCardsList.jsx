"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/Button/Button";
import { BiChevronsLeft } from "react-icons/bi";
import { useLenis } from "@/context/LenisContext";
import styles from "./NewsCardsList.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEP = 3;

const NewsCardsList = ({
  backText,
  cards,
  newsCategories,
  locale,
  moreButton,
  className,
  initialCount,
}) => {
  const [activeCategory, setActiveCategory] = useState(newsCategories[0].slug);

  const filterCards = cards.filter((card) => card.type === activeCategory);

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const lenis = useLenis();

  const rootRef = useRef(null);
  const categoriesWrapperRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const loadMoreButtonRef = useRef(null);

  const isFirstCardsRenderRef = useRef(true);
  const prevVisibleCountRef = useRef(initialCount);

  const visibleCards = filterCards.slice(0, visibleCount);
  const hasMore = visibleCount < filterCards.length;

  function animateCardsIn(cardElements) {
    gsap.fromTo(
      cardElements,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15,
      },
    );
  }

  // Категорії — вхід один раз, зліва направо
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (categoriesWrapperRef.current) {
        const categoryItems = categoriesWrapperRef.current.querySelectorAll(
          `.${styles.category}`,
        );

        gsap.fromTo(
          categoryItems,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: categoriesWrapperRef.current,
              start: "top bottom",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, categoriesWrapperRef);

    return () => {
      ctx.revert();
    };
  }, [newsCategories]);

  // Картки — перший вхід у зону видимості.
  // Мобільний — кожна картка власним тригером.
  // Десктоп/планшет — груповий тригер зі stagger.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const isMobile = context.conditions.isMobile;

          if (!cardsWrapperRef.current) {
            return;
          }

          const cardItems = Array.from(
            cardsWrapperRef.current.querySelectorAll(`.${styles.card}`),
          );

          if (isMobile) {
            cardItems.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0, x: -60 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
          } else {
            gsap.fromTo(
              cardItems,
              { opacity: 0, x: -60 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  trigger: cardsWrapperRef.current,
                  start: "top bottom",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        },
      );

      if (loadMoreButtonRef.current) {
        gsap.fromTo(
          loadMoreButtonRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: loadMoreButtonRef.current,
              start: "top bottom",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, rootRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [cards]);

  // Картки — переанімовуються щоразу, коли міняється категорія
  // (крім першого рендера, який вже обробляє useLayoutEffect вище)
  useEffect(() => {
    if (isFirstCardsRenderRef.current) {
      isFirstCardsRenderRef.current = false;
      prevVisibleCountRef.current = visibleCount;
      return;
    }

    if (!cardsWrapperRef.current) {
      return;
    }

    const cardItems = Array.from(
      cardsWrapperRef.current.querySelectorAll(`.${styles.card}`),
    );

    if (cardItems.length) {
      animateCardsIn(cardItems);
    }

    prevVisibleCountRef.current = visibleCount;
  }, [activeCategory]);

  // Анімуємо ЛИШЕ новододані картки після кліку "завантажити ще"
  useEffect(() => {
    if (visibleCount <= prevVisibleCountRef.current) {
      prevVisibleCountRef.current = visibleCount;
      return;
    }

    if (!cardsWrapperRef.current) {
      prevVisibleCountRef.current = visibleCount;
      return;
    }

    const allCards = Array.from(
      cardsWrapperRef.current.querySelectorAll(`.${styles.card}`),
    );
    const newCards = allCards.slice(prevVisibleCountRef.current);

    if (newCards.length) {
      animateCardsIn(newCards);
    }

    prevVisibleCountRef.current = visibleCount;
  }, [visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, filterCards.length));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis?.resize();
      });
    });
  };

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setVisibleCount(initialCount);
    prevVisibleCountRef.current = initialCount;
  };

  return (
    <div ref={rootRef}>
      <div className={styles.titleWrapper}>
        <div className={styles.categoriesWrapper} ref={categoriesWrapperRef}>
          {newsCategories.map((item) => (
            <div
              className={`${styles.category} ${
                item.slug === activeCategory ? styles.active : ""
              }`}
              key={item.slug}
              onClick={() => handleCategoryChange(item.slug)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <Link href={locale === "en" ? "/en" : "/"} className={styles.back}>
          <BiChevronsLeft className={styles.iconBack} />
          <p>{backText}</p>
        </Link>
      </div>

      <div className={styles.cardsWrapper} ref={cardsWrapperRef}>
        {visibleCards.map((item) => (
          <Link
            className={styles.card}
            key={item.slug}
            href={`${locale === "en" ? "/en" : ""}/news/${item.slug}`}
          >
            <div className={styles.cardInner}>
              <div className={styles.imageWrapper}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.image.url}`}
                  fill
                  alt="main image"
                  className={styles.image}
                ></Image>
              </div>

              <p className={styles.mounth}>
                {activeCategory === "news" ? item.month : item.dateBy}
              </p>

              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDescription}>{item.description}</div>
              <span className={styles.line}></span>
              <div className={styles.button}>{item.button.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreButtonRef}>
          <Button
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
            title={moreButton.title}
            icon={moreButton.icon.url}
            small
          ></Button>
        </div>
      )}
    </div>
  );
};

export default NewsCardsList;
