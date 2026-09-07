"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import styles from "./Infrastructure.module.css";

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
  console.log(data);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);

  const homeMarkersRef = useRef([]);
  const categoryMarkersRef = useRef([]);

  const categories = data?.mapCategoris || [];

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  /*
   * =========================
   * MAP INITIALIZATION
   * =========================
   */

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

          /*
           * =========================
           * HOME LABEL
           * =========================
           */

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

  /*
   * =========================
   * CATEGORY MARKERS
   * =========================
   */

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

      /*
       * =========================
       * DOT
       * =========================
       */

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

      /*
       * =========================
       * SELECTED LABEL
       * =========================
       */

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

  /*
   * =========================
   * TAB CLICK
   * =========================
   */

  const handleTabClick = (index) => {
    setActiveCategory(index);
    setActiveIndex(0);
  };

  /*
   * =========================
   * ROW CLICK
   * =========================
   */

  const handleRowClick = (index) => {
    setActiveIndex(index);
  };

  const currentCategory = categories[activeCategory];

  const currentPlaces = currentCategory?.places || [];

  return (
    <div className={styles.infrastructure}>
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
        className={styles.blockTitle}
      />

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

      <div className={styles.widget}>
        {/* TABS */}

        <div className={styles.tabs}>
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
          {/* MAP */}

          <div className={styles.mapWrap}>
            <div ref={mapContainerRef} className={styles.map} />
          </div>

          {/* PLACES */}

          <div className={styles.placeList}>
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
