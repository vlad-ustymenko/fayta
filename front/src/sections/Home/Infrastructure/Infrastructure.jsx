"use client";

import { useEffect, useLayoutEffect, useRef, useState, memo } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import styles from "./Infrastructure.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const AnimatedIntro = memo(function AnimatedIntro({ blockTitle, title }) {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none none",
      };

      let blockTitleTween;
      if (blockTitleRef.current) {
        blockTitleTween = gsap.fromTo(
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

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [blockTitle, title]);

  return (
    <div ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={blockTitle.title}
          image={blockTitle.image.url}
          className={styles.blockTitle}
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
        {title}
      </ReactMarkdown>
    </div>
  );
});

function createDotElement(muted) {
  const element = document.createElement("div");

  element.className = muted
    ? `${styles.pinDot} ${styles.pinDotMuted}`
    : styles.pinDot;

  return element;
}

function createPlaceLabel(place) {
  const element = document.createElement("div");

  element.className = styles.placeLabel;

  const name = document.createElement("div");
  name.className = styles.placeLabelName;
  name.textContent = place.name;

  const time = document.createElement("div");
  time.className = styles.placeLabelTime;
  time.textContent = place.time;

  element.appendChild(name);
  element.appendChild(time);

  return element;
}

function createHomePin() {
  const element = document.createElement("div");

  element.className = styles.homePin;

  return element;
}

function createHomeLabel(name) {
  const element = document.createElement("div");

  element.className = styles.homeLabel;
  element.textContent = name;

  return element;
}

export default function InfrastructureWidget({ data }) {
  const rootRef = useRef(null);
  const tabsRef = useRef(null);
  const mapWrapRef = useRef(null);
  const placeListRef = useRef(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);

  const homeMarkersRef = useRef([]);
  const categoryMarkersRef = useRef([]);

  const categories = data?.mapCategoris || [];

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map = null;

    async function initMap() {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      if (!data?.homePlace.lat || !data?.homePlace.lng) {
        console.error("Infrastructure: home coordinates are missing");
        return;
      }

      try {
        const module = await import("maplibre-gl");

        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const MapLibre = module.default || module;

        maplibreRef.current = MapLibre;

        map = new MapLibre.Map({
          container: mapContainerRef.current,

          style: "https://tiles.openfreemap.org/styles/positron",

          center: [Number(data.homePlace.lng), Number(data.homePlace.lat)],

          zoom: 12,

          attributionControl: true,

          dragRotate: false,
          touchPitch: false,
        });

        map.scrollZoom.disable();

        map.addControl(
          new MapLibre.NavigationControl({
            showCompass: false,
          }),
          "top-right",
        );

        map.on("error", (event) => {
          console.error("MapLibre error:", event);
        });

        map.on("load", () => {
          if (cancelled) {
            return;
          }

          mapRef.current = map;

          const homePin = new MapLibre.Marker({
            element: createHomePin(),
            anchor: "center",
          })
            .setLngLat([Number(data.homePlace.lng), Number(data.homePlace.lat)])
            .addTo(map);

          const homeLabel = new MapLibre.Marker({
            element: createHomeLabel(data.homePlace.name),
            anchor: "bottom",
            offset: [0, -14],
          })
            .setLngLat([Number(data.homePlace.lng), Number(data.homePlace.lat)])
            .addTo(map);

          homeMarkersRef.current = [homePin, homeLabel];

          setReady(true);
        });
      } catch (error) {
        console.error("Failed to initialize MapLibre:", error);
      }
    }

    initMap();

    return () => {
      cancelled = true;

      categoryMarkersRef.current.forEach((marker) => {
        marker.remove();
      });

      homeMarkersRef.current.forEach((marker) => {
        marker.remove();
      });

      categoryMarkersRef.current = [];
      homeMarkersRef.current = [];

      if (map) {
        map.remove();
      }

      mapRef.current = null;
      maplibreRef.current = null;
    };
  }, [data]);

  useEffect(() => {
    if (!ready || !mapRef.current || !maplibreRef.current) {
      return;
    }

    const map = mapRef.current;
    const MapLibre = maplibreRef.current;

    categoryMarkersRef.current.forEach((marker) => {
      marker.remove();
    });

    categoryMarkersRef.current = [];

    const category = categories[activeCategory];

    if (!category) {
      return;
    }

    const places = category.places || [];

    if (!places.length) {
      return;
    }

    const selectedIndex = activeIndex >= places.length ? 0 : activeIndex;

    if (selectedIndex !== activeIndex) {
      setActiveIndex(0);
      return;
    }

    places.forEach((place, index) => {
      const isSelected = index === selectedIndex;

      const dotElement = createDotElement(!isSelected);

      const marker = new MapLibre.Marker({
        element: dotElement,
        anchor: "center",
      })
        .setLngLat([Number(place.lng), Number(place.lat)])
        .addTo(map);

      dotElement.addEventListener("click", () => {
        setActiveIndex(index);
      });

      categoryMarkersRef.current.push(marker);

      if (isSelected) {
        const labelElement = createPlaceLabel(place);

        const label = new MapLibre.Marker({
          element: labelElement,
          anchor: "bottom",
          offset: [0, -50],
        })
          .setLngLat([Number(place.lng), Number(place.lat)])
          .addTo(map);

        categoryMarkersRef.current.push(label);

        requestAnimationFrame(() => {
          if (!mapRef.current) {
            return;
          }

          map.easeTo({
            center: [Number(place.lng), Number(place.lat)],

            padding: {
              top: 100,
              bottom: 30,
              left: 30,
              right: 30,
            },

            duration: 500,
            essential: true,
          });
        });
      }
    });
  }, [ready, activeCategory, activeIndex, categories]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none none",
      };

      if (tabsRef.current) {
        const tabItems = tabsRef.current.querySelectorAll(`.${styles.tab}`);

        gsap.fromTo(
          tabItems,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              ...commonTrigger,
              trigger: tabsRef.current,
            },
          },
        );
      }

      if (mapWrapRef.current) {
        gsap.fromTo(
          mapWrapRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: mapWrapRef.current,
            },
          },
        );
      }

      if (placeListRef.current) {
        const rowItems = placeListRef.current.querySelectorAll(
          `.${styles.placeRow}`,
        );

        gsap.fromTo(
          rowItems,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              ...commonTrigger,
              trigger: placeListRef.current,
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
  }, [data]);

  const handleTabClick = (index) => {
    setActiveCategory(index);
    setActiveIndex(0);
  };

  const handleRowClick = (index) => {
    setActiveIndex(index);
  };

  const currentCategory = categories[activeCategory];

  const currentPlaces = currentCategory?.places || [];

  return (
    <div className={styles.infrastructure} ref={rootRef}>
      <AnimatedIntro blockTitle={data.blockTitle} title={data.title} />

      <div className={styles.widget}>
        <div className={styles.tabs} ref={tabsRef}>
          {categories.map((category, index) => {
            const isActive = index === activeCategory;

            return (
              <button
                key={category.id || category.name}
                type="button"
                onClick={() => handleTabClick(index)}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className={styles.content}>
          <div className={styles.mapWrap} ref={mapWrapRef}>
            <div ref={mapContainerRef} className={styles.map} />
          </div>

          <div className={styles.placeList} ref={placeListRef}>
            {currentPlaces.map((place, index) => {
              const isSelected = index === activeIndex;

              return (
                <div
                  key={place.id || `${place.name}-${index}`}
                  onClick={() => handleRowClick(index)}
                  className={styles.placeRow}
                >
                  <span
                    className={`${styles.placeName} ${
                      isSelected ? styles.placeNameSelected : ""
                    }`}
                  >
                    {place.name}
                  </span>

                  <span className={styles.placeTime}>{place.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
