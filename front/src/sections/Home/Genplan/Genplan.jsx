"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import styles from "./Genplan.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Genplan = ({ data }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleMarkerClick = (id) => {
    if (!isMobile) {
      return;
    }

    setActiveMarker((current) => (current === id ? null : id));
  };

  const handleMouseEnter = (id) => {
    if (isMobile) {
      return;
    }

    setHoveredMarker(id);
  };

  const handleMouseLeave = () => {
    if (isMobile) {
      return;
    }

    setHoveredMarker(null);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!blockTitleRef.current) {
        return;
      }

      gsap.fromTo(
        blockTitleRef.current,
        {
          opacity: 0,
          x: -80,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",

          scrollTrigger: {
            trigger: blockTitleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      ScrollTrigger.refresh();
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [data]);

  return (
    <div ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
          className={styles.blockTitle}
        />
      </div>

      <div className={styles.masterplan}>
        <div className={styles.viewport}>
          <div className={styles.plan}>
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`}
              alt="genplan"
              width={3840}
              height={2160}
              priority
              sizes="100vw"
              className={styles.image}
            />

            <div className={styles.markers}>
              {data.genplanMarkers.map((marker) => {
                const isActive = isMobile
                  ? activeMarker === marker.id
                  : hoveredMarker === marker.id;

                return (
                  <div
                    key={marker.id}
                    className={styles.marker}
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                    }}
                    onMouseEnter={() => handleMouseEnter(marker.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`${styles.markerButton} ${
                        isActive ? styles.markerButtonActive : ""
                      }`}
                      onClick={() => handleMarkerClick(marker.id)}
                      aria-label={marker.title}
                      aria-expanded={isActive}
                    >
                      <span className={styles.markerDot} />
                    </button>

                    {isActive && (
                      <div className={styles.tooltip}>
                        <div className={styles.tooltipTitle}>
                          {marker.title}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Genplan;
