"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Developer.module.css";
import Image from "next/image";
import { gsap } from "gsap";
import ReactMarkdown from "react-markdown";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImQuotesLeft } from "react-icons/im";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";

gsap.registerPlugin(ScrollTrigger);

const Developer = ({ data }) => {
  const blockTitleRef = useRef(null);
  const imageRef = useRef(null);
  const statsWrapperRef = useRef(null);
  const statItemsRef = useRef([]);

  const titleRefs = useRef([]);
  const textRefs = useRef([]);

  statItemsRef.current = [];

  const addToTitleRefs = (el) => {
    if (el && !titleRefs.current.includes(el)) {
      titleRefs.current.push(el);
    }
  };

  const addToTextRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  const addToStatRefs = (el) => {
    if (el && !statItemsRef.current.includes(el)) {
      statItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        blockTitleRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blockTitleRef.current,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );

      titleRefs.current.forEach((el) => {
        gsap.fromTo(
          el,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              toggleActions: "play none none none",
            },
          },
        );
      });

      textRefs.current.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 100%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      if (statItemsRef.current.length) {
        gsap.fromTo(
          statItemsRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: statsWrapperRef.current,
              start: "top bottom",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      titleRefs.current = [];
      textRefs.current = [];
    };
  }, []);

  return (
    <section className={styles.developer} id="developer">
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
        ref={blockTitleRef}
        className={styles.blockTitle}
      />
      <div className={styles.container}>
        <div className={styles.imageWrapper} ref={imageRef}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.logo.url}`}
            fill
            sizes="(max-width: 768px) 95vw, (min-width: 768px) and (max-width: 1023px) 50vw, 28vw"
            alt="developer"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p ref={addToTitleRefs} className={styles.title}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <span className={styles.strong}>{children}</span>
              ),
            }}
          >
            {data.title}
          </ReactMarkdown>

          <ImQuotesLeft className={styles.quote} />

          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p ref={addToTextRefs} className={styles.text}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className={styles.textList}>{children}</ul>
              ),
              li: ({ children }) => (
                <li ref={addToTextRefs} className={styles.text}>
                  {children}
                </li>
              ),
            }}
          >
            {data.description}
          </ReactMarkdown>
          <span className={styles.line}></span>
          <div className={styles.statsWrapper} ref={statsWrapperRef}>
            {data.stats.map((item) => (
              <div
                key={item.bigText}
                className={styles.stat}
                ref={addToStatRefs}
              >
                <p className={styles.bigText}>{item.bigText}</p>
                <p className={styles.smallText}>{item.smallText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Developer;
