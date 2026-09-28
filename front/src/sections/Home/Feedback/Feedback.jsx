"use client";
import React, { useLayoutEffect, useRef } from "react";
import Form from "../../../components/Form/Form";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "./Feedback.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Feedback = ({ data, className }) => {
  const rootRef = useRef(null);
  const leftBlockNameRef = useRef(null);
  const leftBlockTitleRef = useRef(null);
  const leftBlockTextRef = useRef(null);
  const phoneTitleRef = useRef(null);
  const phoneRef = useRef(null);
  const rightBlockRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

      function splitAndAnimate(element, options) {
        const delay = options && options.delay ? options.delay : 0;
        const scrollTrigger = options ? options.scrollTrigger : undefined;

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
          delay: delay,
          ease: "power3.out",
          scrollTrigger: scrollTrigger,
        });

        return split;
      }

      if (leftBlockNameRef.current) {
        gsap.fromTo(
          leftBlockNameRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: leftBlockNameRef.current,
            },
          },
        );
      }

      let titleSplit;
      if (leftBlockTitleRef.current) {
        titleSplit = splitAndAnimate(leftBlockTitleRef.current, {
          delay: 0.1,
          scrollTrigger: {
            ...commonTrigger,
            trigger: leftBlockTitleRef.current,
          },
        });
      }

      if (leftBlockTextRef.current) {
        gsap.fromTo(
          leftBlockTextRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: leftBlockTextRef.current,
            },
          },
        );
      }

      if (phoneTitleRef.current) {
        gsap.fromTo(
          phoneTitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: phoneTitleRef.current,
            },
          },
        );
      }

      if (phoneRef.current) {
        gsap.fromTo(
          phoneRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.1,
            scrollTrigger: {
              ...commonTrigger,
              trigger: phoneRef.current,
            },
          },
        );
      }

      if (rightBlockRef.current) {
        gsap.fromTo(
          rightBlockRef.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: rightBlockRef.current,
            },
          },
        );
      }

      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: imageWrapperRef.current,
            },
          },
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (titleSplit) titleSplit.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <div className={`${styles.feedback} ${className}`} ref={rootRef}>
      <div className={styles.leftBlock}>
        <p className={styles.leftBlockName} ref={leftBlockNameRef}>
          {data.leftBlockName}
        </p>

        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <h1 className={styles.leftBlockTitle} ref={leftBlockTitleRef}>
                {children}
              </h1>
            ),
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {data.leftBlockTitle}
        </ReactMarkdown>

        <p className={styles.leftBlockText} ref={leftBlockTextRef}>
          {data.leftBlockText}
        </p>

        <p className={styles.phoneTitle} ref={phoneTitleRef}>
          {data.phoneTitle}
        </p>

        <a href={`tel:${data.phone}`} className={styles.phone} ref={phoneRef}>
          {data.phone}
        </a>
      </div>

      <div className={styles.rightBlock} ref={rightBlockRef}>
        <div className={styles.imageWrapper} ref={imageWrapperRef}>
          <Image src="/black.png" alt="image" fill className={styles.image} />
        </div>

        <p className={styles.rightBlockName}>{data.rightBlockName}</p>
        <h2 className={styles.rightBlockTitle}>{data.rightBlockTitle}</h2>

        <Form
          form={data.form}
          button={data.button}
          confidentialText={data.confidentialText}
          feedback
        />
      </div>
    </div>
  );
};

export default Feedback;
