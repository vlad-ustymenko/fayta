"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/Button/Button";
import { useLenis } from "@/context/LenisContext";
import styles from "./BuildingCardsList.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEP = 3;

const BuildingCardsList = ({
  cards,
  locale,
  moreButton,
  className,
  initialCount,
}) => {
  const lenis = useLenis();
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const rootRef = useRef(null);
  console.log(initialCount);
  const cardsWrapperRef = useRef(null);
  const loadMoreButtonRef = useRef(null);
  const prevVisibleCountRef = useRef(initialCount);

  const visibleCards = cards.slice(0, visibleCount);
  const hasMore = visibleCount < cards.length;

  function animateCards(cardElements) {
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

  // Перший вхід у зону видимості. Мобільний — кожна картка
  // власним тригером. Десктоп/планшет — груповий тригер зі stagger.
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
      animateCards(newCards);
    }

    prevVisibleCountRef.current = visibleCount;
  }, [visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, cards.length));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis?.resize();
      });
    });
  };

  return (
    <div ref={rootRef}>
      <div
        className={`${styles.cardsWrapper} ${className}`}
        ref={cardsWrapperRef}
      >
        {visibleCards.map((item) => (
          <Link
            className={styles.card}
            key={item.slug}
            href={`${locale === "en" ? "/en" : ""}/building/${item.slug}`}
          >
            <div className={styles.cardInner}>
              <div className={styles.imageWrapper}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.images[0].url}`}
                  fill
                  alt="main image"
                  className={styles.image}
                />
              </div>
              <div className={styles.mounthWrapper}>
                <Button
                  className={styles.button}
                  title={item.button.title}
                  icon={item.button.icon.url}
                  small
                />
                <p className={styles.mounth}>{item.mounth}</p>
              </div>
              <div className={styles.cardTitle}>{item.title}</div>
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

export default BuildingCardsList;
