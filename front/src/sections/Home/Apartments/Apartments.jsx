"use client";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import React, { memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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

gsap.registerPlugin(ScrollTrigger, SplitText);

const HIDDEN_STATE = { scale: 0.5, xPercent: 0, opacity: 0, zIndex: 1 };
const SWIPE_THRESHOLD = 50;

// Винесено окремо і обгорнуто в memo — не ре-рендериться при зміні
// index/activeCategory у батьківському компоненті, тому DOM,
// перебудований SplitText для title, лишається недоторканим.
const AnimatedHeader = memo(function AnimatedHeader({
  blockTitle,
  title,
  button,
  locale,
}) {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const buttonMoreRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

      if (blockTitleRef.current) {
        gsap.fromTo(
          blockTitleRef.current,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: blockTitleRef.current,
            },
          },
        );
      }

      let titleSplit;
      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(titleSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });

        gsap.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            ...commonTrigger,
            trigger: titleRef.current,
          },
        });
      }

      if (buttonMoreRef.current) {
        gsap.fromTo(
          buttonMoreRef.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: buttonMoreRef.current,
            },
          },
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [blockTitle, title, button]);

  return (
    <div ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={blockTitle.title}
          image={blockTitle.image.url}
          className={styles.blockTitle}
        />
      </div>
      <div className={styles.titleWrapper}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <h2 className={styles.title} ref={titleRef}>
                {children}
              </h2>
            ),
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {title}
        </ReactMarkdown>
        <div ref={buttonMoreRef}>
          <Button
            title={button.title}
            link
            href={`${locale === "en" ? "/en" : ""}${button.href}`}
            small
            icon={button.icon.url}
            className={styles.buttonMore}
          ></Button>
        </div>
      </div>
    </div>
  );
});

const Apartments = ({ data, locale }) => {
  const { setOpenSidebar } = useSidebarContext();
  const [activeCategory, setActiveCategory] = useState(
    data.apartmentCategories[0]?.slug ?? null,
  );
  const [index, setIndex] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const cardsRef = useRef([]);
  const touchStartX = useRef(null);

  const categoriesWrapperRef = useRef(null);

  const filteredCards = useMemo(
    () =>
      data.apartment_cards.filter((card) => card.category === activeCategory),
    [data.apartment_cards, activeCategory],
  );

  const total = filteredCards.length;

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

  useLayoutEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, total);
  }, [total, activeCategory]);

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
        duration: 1,
        ease: "power2.inOut",
      });
      card.style.zIndex = String(pos.zIndex);
      card.style.pointerEvents = pos.opacity === 0 ? "none" : "auto";
    });
  }, [index, positionsByOffset, getOffset, total, activeCategory]);

  // Анімація категорій — знизу вгору, opacity, по черзі.
  // Прив'язана лише до [data], тому спрацьовує один раз при вході
  // в зону видимості (перемикання activeCategory просто змінює
  // className активного елемента, не чіпаючи GSAP-стилі transform/opacity).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (categoriesWrapperRef.current) {
        const categoryItems = categoriesWrapperRef.current.querySelectorAll(
          `.${styles.category}`,
        );

        gsap.fromTo(
          categoryItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
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

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, categoriesWrapperRef);

    return () => ctx.revert();
  }, [data]);

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
      <AnimatedHeader
        blockTitle={data.blockTitle}
        title={data.title}
        button={data.button}
        locale={locale}
      />

      <div className={styles.categoriesWrapper} ref={categoriesWrapperRef}>
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
