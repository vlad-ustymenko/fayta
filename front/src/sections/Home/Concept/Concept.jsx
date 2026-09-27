"use client";
import React, { useLayoutEffect, useRef } from "react";
import styles from "./Concept.module.css";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import remarkBreaks from "remark-breaks";
import MaskedMedia from "../../../components/MaskedMedia/MaskedMedia";
import Button from "../../../components/Button/Button";
import { useSidebarContext } from "@/context/SidebarContext";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Concept = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();

  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const statsWrapperRef = useRef(null);
  const maskedMediaRef = useRef(null);

  // варіант 2: масив рефів на кожен <p> опису
  const descriptionParagraphsRef = useRef([]);
  descriptionParagraphsRef.current = [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none none",
      };

      function splitAndAnimate(element, { delay = 0, scrollTrigger } = {}) {
        const split = new SplitText(element, {
          type: "lines",
          linesClass: styles.line,
          mask: "lines",
        });

        gsap.set(split.lines, {
          yPercent: 100,
          opacity: 0,
        });

        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          delay,
          ease: "power5.out",
          scrollTrigger,
        });

        return split;
      }

      if (blockTitleRef.current) {
        gsap.fromTo(
          blockTitleRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: blockTitleRef.current,
            },
          },
        );
      }

      let titleSplit;
      if (titleRef.current) {
        titleSplit = splitAndAnimate(titleRef.current, {
          delay: 0,
          scrollTrigger: {
            ...commonTrigger,
            trigger: titleRef.current,
          },
        });
      }

      let descriptionSplits = [];
      if (descriptionParagraphsRef.current.length) {
        descriptionSplits = descriptionParagraphsRef.current.map((el, i) =>
          splitAndAnimate(el, {
            delay: (titleRef.current ? 0.15 : 0) + i * 0.05,
            scrollTrigger: {
              ...commonTrigger,
              trigger: el,
            },
          }),
        );
      }

      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: buttonRef.current,
            },
          },
        );
      }

      if (statsWrapperRef.current) {
        const statItems = statsWrapperRef.current.querySelectorAll(
          `.${styles.statWrapper}`,
        );

        gsap.fromTo(
          statItems,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
              ...commonTrigger,
              trigger: statsWrapperRef.current,
            },
          },
        );
      }

      if (maskedMediaRef.current) {
        gsap.fromTo(
          maskedMediaRef.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 2,
            ease: "power4.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: maskedMediaRef.current,
            },
          },
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (titleSplit) titleSplit.revert();
        descriptionSplits.forEach((split) => split.revert());
      };
    }, rootRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <div className={styles.concept} id="concept" ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        />
      </div>
      <div className={styles.grid}>
        <div className={styles.content}>
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

          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p
                  className={styles.description}
                  ref={(el) => {
                    if (el) descriptionParagraphsRef.current.push(el);
                  }}
                >
                  {children}
                </p>
              ),
            }}
          >
            {data.description}
          </ReactMarkdown>

          <div ref={buttonRef}>
            <Button
              title={data.button.title}
              icon={data.button.icon.url}
              className={styles.button}
              onClick={() => setOpenSidebar(true)}
            ></Button>
          </div>
          <div className={styles.statsWrapper} ref={statsWrapperRef}>
            {data.stats.map((item) => {
              return (
                <div className={styles.statWrapper} key={item.id}>
                  <p className={styles.bigText}>{item.bigText}</p>
                  <p className={styles.smallText}>{item.smallText}</p>
                </div>
              );
            })}
          </div>
        </div>

        <MaskedMedia
          ref={maskedMediaRef}
          src={data.maskedImage.backgroundImage.url}
          type="image"
          logoSrc={data.maskedImage.maskImage.url}
          className={styles.maskedMedia}
        ></MaskedMedia>
      </div>
    </div>
  );
};

export default Concept;
