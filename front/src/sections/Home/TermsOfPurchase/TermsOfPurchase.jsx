"use client";

import React, { useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import Button from "../../../components/Button/Button";
import { useSidebarContext } from "@/context/SidebarContext";
import styles from "./TermsOfPurchase.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TermsOfPurchase = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();

  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none none",
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

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions;

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
                  duration: 1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    toggleActions: "play none none none",
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
                duration: 1,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  ...commonTrigger,
                  trigger: cardsWrapperRef.current,
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
    }, rootRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [data]);

  return (
    <div className={styles.termsOfPurchase} id="termsOfPurchese" ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        />
      </div>
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
        {data.title}
      </ReactMarkdown>
      <div className={styles.cardsWrapper} ref={cardsWrapperRef}>
        {data.cards.map((item) => (
          <div className={styles.card} key={item.id}>
            <div
              className={styles.cardInner}
              onClick={() => setOpenSidebar(true)}
            >
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDescription}>{item.description}</div>
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  p: ({ children }) => (
                    <p className={styles.cardTerms}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <span className={styles.strongTerms}>{children}</span>
                  ),
                }}
              >
                {item.terms}
              </ReactMarkdown>
              <Button
                className={styles.cardButton}
                title={item.button.title}
                href={item.button.href}
                icon={item.button.icon.url}
                small
              ></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfPurchase;
