"use client";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button from "../../../components/Button/Button";
import Image from "next/image";
import Link from "next/link";
import styles from "./News.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const AnimatedHeader = memo(function AnimatedHeader({
  blockTitle,
  title,
  button,
  locale,
}) {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);

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

      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: buttonRef.current,
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
        <BlockTitle title={blockTitle.title} image={blockTitle.image.url} />
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
        <div ref={buttonRef} className={styles.buttonMore}>
          <Button
            title={button.title}
            link
            href={`${locale === "en" ? "/en" : ""}${button.href}`}
            icon={button.icon.url}
            small
          ></Button>
        </div>
      </div>
    </div>
  );
});

const News = ({ data, locale }) => {
  const [activeCategory, setActiveCategory] = useState(
    data.newsCategories[0].slug,
  );

  const categoriesWrapperRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  const filterCards = data.news_cards.filter(
    (card) => card.type === activeCategory,
  );

  function playCardsAnimation(isMobile) {
    if (!cardsWrapperRef.current) return;

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
        },
      );
    }
  }

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

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, categoriesWrapperRef);

    return () => ctx.revert();
  }, [data]);

  const isMobileRef = useRef(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions;
          isMobileRef.current = isMobile;

          if (isMobile) {
            playCardsAnimation(true);
          } else {
            if (!cardsWrapperRef.current) return;

            const cardItems = Array.from(
              cardsWrapperRef.current.querySelectorAll(`.${styles.card}`),
            );

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

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, cardsWrapperRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [data]);

  useEffect(() => {
    playCardsAnimation(false);
  }, [activeCategory]);

  return (
    <div className={styles.news} id="news">
      <AnimatedHeader
        blockTitle={data.blockTitle}
        title={data.title}
        button={data.button}
        locale={locale}
      />

      <div className={styles.categoriesWrapper} ref={categoriesWrapperRef}>
        {data.newsCategories.map((item) => (
          <div
            className={`${styles.category} ${
              item.slug === activeCategory ? styles.active : ""
            }`}
            key={item.slug}
            onClick={() => setActiveCategory(item.slug)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className={styles.cardsWrapper} ref={cardsWrapperRef}>
        {filterCards.slice(0, 3).map((item) => (
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

              <p className={styles.cardTitle}>{item.title}</p>
              <p className={styles.cardDescription}>{item.description}</p>
              <span className={styles.line}></span>
              <div className={styles.button}>{item.button.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default News;
