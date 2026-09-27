"use client";
import React, { useLayoutEffect, useRef } from "react";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./Investment.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Investment = ({ data }) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.investmentList[0].leftBlockIcon.url}`;

  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const leftBlockRef = useRef(null);
  const rightBlockWrapperRef = useRef(null);

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
          linesClass: "split-line",
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
          ease: "power3.out",
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
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: blockTitleRef.current,
            },
          },
        );
      }

      let titleSplit;
      let descriptionSplit;

      if (titleRef.current) {
        titleSplit = splitAndAnimate(titleRef.current, {
          delay: 0,
          scrollTrigger: { ...commonTrigger, trigger: titleRef.current },
        });
      }

      if (descriptionRef.current) {
        descriptionSplit = splitAndAnimate(descriptionRef.current, {
          delay: titleRef.current ? 0.15 : 0,
          scrollTrigger: { ...commonTrigger, trigger: descriptionRef.current },
        });
      }

      if (leftBlockRef.current) {
        const items = leftBlockRef.current.querySelectorAll(
          `.${styles.leftBlockTitle}`,
        );

        gsap.fromTo(
          items,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: { ...commonTrigger, trigger: leftBlockRef.current },
          },
        );
      }

      if (rightBlockWrapperRef.current) {
        const items = rightBlockWrapperRef.current.querySelectorAll(
          `.${styles.rightBlock}`,
        );

        gsap.fromTo(
          items,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
              ...commonTrigger,
              trigger: rightBlockWrapperRef.current,
            },
          },
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (titleSplit) titleSplit.revert();
        if (descriptionSplit) descriptionSplit.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <div className={styles.investment} ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        ></BlockTitle>
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

      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => (
            <p className={styles.description} ref={descriptionRef}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <span className={styles.strong}>{children}</span>
          ),
        }}
      >
        {data.description}
      </ReactMarkdown>

      <div className={styles.investmentList}>
        <div className={styles.leftBlock} ref={leftBlockRef}>
          {data.investmentList.map((item) => (
            <p
              key={item.id}
              className={styles.leftBlockTitle}
              style={{ "--after-image": `url(${imageUrl})` }}
            >
              {item.leftBlockTitle}
            </p>
          ))}
        </div>

        <div ref={rightBlockWrapperRef}>
          {data.investmentList.map((item, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            return (
              <div className={styles.rightBlock} key={item.id}>
                <p
                  className={styles.rightBlockTitle}
                  style={{ "--index": `"${formattedIndex}"` }}
                >
                  {item.rightBlockTitle}
                </p>
                <p className={styles.rightBlockDescription}>
                  {item.rightBlockDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Investment;
