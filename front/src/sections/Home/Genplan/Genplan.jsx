"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./Genplan.module.css";
const markers = [
  { id: 1, x: 15.6, y: 45, title: "Наземний паркінг" },
  { id: 2, x: 31, y: 56, title: "Салон краси" },
  { id: 3, x: 40.5, y: 70.5, title: "Наземний паркінг" },
  { id: 4, x: 45.2, y: 69.8, title: "Магазин" },
  { id: 5, x: 49.7, y: 74.2, title: "Кав`ярня" },
  { id: 6, x: 53.5, y: 77.8, title: "Фітнес" },
  { id: 7, x: 60.3, y: 73.9, title: "Фітнес" },
  { id: 8, x: 49.7, y: 51.2, title: "Фітнес" },
  { id: 9, x: 56.5, y: 42, title: "Фітнес" },
  { id: 10, x: 65.7, y: 33.6, title: "Фітнес" },
  { id: 11, x: 51.1, y: 28.8, title: "Фітнес" },
  { id: 12, x: 42.6, y: 14.7, title: "Фітнес" },
];
const Genplan = ({ data }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
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
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => <h2 className={styles.title}>{children}</h2>,
          strong: ({ children }) => (
            <span className={styles.strong}>{children}</span>
          ),
        }}
      >
        {data.title}
      </ReactMarkdown>
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
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    onMouseEnter={() => handleMouseEnter(marker.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`${styles.markerButton} ${isActive ? styles.markerButtonActive : ""}`}
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
    </>
  );
};
export default Genplan;
