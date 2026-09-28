"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "./FAQList.module.css";
import { BiChevronsDown } from "react-icons/bi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQList = ({ data }) => {
  const [activeId, setActiveId] = useState(data[0].id);

  const rootRef = useRef(null);
  const listRef = useRef(null);

  const toggleTab = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

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

          if (!listRef.current) {
            return;
          }

          const tabs = Array.from(
            listRef.current.querySelectorAll(`.${styles.tabWrapper}`),
          );

          if (isMobile) {
            tabs.forEach((tab) => {
              gsap.fromTo(
                tab,
                { opacity: 0, x: 80 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: tab,
                    start: "top bottom",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
          } else {
            gsap.fromTo(
              tabs,
              { opacity: 0, x: 80 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.12,
                scrollTrigger: {
                  trigger: listRef.current,
                  start: "top bottom",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        },
      );

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
  }, [data]);

  return (
    <div className={styles.faq} id="faq" ref={rootRef}>
      <div ref={listRef}>
        {data.map((item) => (
          <div
            key={item.id}
            className={styles.tabWrapper}
            onClick={() => toggleTab(item.id)}
          >
            <div className={styles.tabTitleWrapper}>
              <p
                className={`${styles.tabTitle} ${
                  activeId === item.id ? styles.activeTab : ""
                }`}
              >
                {item.title}
              </p>

              <div className={styles.iconWrapper}>
                <BiChevronsDown
                  className={
                    activeId === item.id
                      ? `${styles.icon} ${styles.rotate}`
                      : styles.icon
                  }
                />
              </div>
            </div>

            <div
              className={`${styles.tabDescription} ${
                activeId === item.id ? styles.open : ""
              }`}
            >
              <p className={styles.tabContent}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQList;
