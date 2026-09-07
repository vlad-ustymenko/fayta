"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import styles from "./ApartmentsCarousel.module.css";
import Image from "next/image";

const data = [1, 2, 3, 4, 5];

const characters = [
  { character: "1", label: "1-кімнатні" },
  { character: "2", label: "2-кімнатні" },
  { character: "3", label: "3-кімнатні" },
];

const ApartmentsCarousel = forwardRef(function ApartmentsCarousel(
  { onIndexChange },
  ref,
) {
  const [index, setIndex] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);

  const cardsRef = useRef([]);

  useEffect(() => {
    const updateWidth = () => setViewWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const positions = useMemo(() => {
    const configs = {
      mobile: [
        { scale: 0.6, xPercent: -30, opacity: 0, zIndex: 3 },
        { scale: 0.6, xPercent: -30, opacity: 0.6, zIndex: 3 },
        { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        { scale: 0.6, xPercent: 30, opacity: 0.6, zIndex: 4 },
        { scale: 0.6, xPercent: 30, opacity: 0, zIndex: 4 },
      ],
      desktop: [
        { scale: 0.8, xPercent: -22, opacity: 0, zIndex: 4 },
        { scale: 0.8, xPercent: -22, opacity: 0.4, zIndex: 4 },
        { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        { scale: 0.8, xPercent: 22, opacity: 0.4, zIndex: 4 },
        { scale: 0.8, xPercent: 22, opacity: 0, zIndex: 4 },
      ],
      tablet: [
        { scale: 0.8, xPercent: -20, opacity: 0, zIndex: 4 },
        { scale: 0.8, xPercent: -20, opacity: 0.6, zIndex: 4 },
        { scale: 1, xPercent: 0, opacity: 1, zIndex: 5 },
        { scale: 0.8, xPercent: 20, opacity: 0.6, zIndex: 4 },
        { scale: 0.8, xPercent: 20, opacity: 0, zIndex: 4 },
      ],
    };
    return viewWidth < 768
      ? configs.mobile
      : viewWidth > 1919
        ? configs.desktop
        : configs.tablet;
  }, [viewWidth]);

  // обчислюємо позицію для слайда
  const getPosition = useCallback(
    (i) => (i - index + data.length) % data.length,
    [index],
  );

  // анімація при зміні index
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const posIndex = getPosition(i);
      const { scale, xPercent, opacity, zIndex } = positions[posIndex];

      gsap.to(card, {
        scale,
        xPercent,
        opacity,
        duration: 0.6,
        ease: "power2.inOut",
      });
      card.style.zIndex = String(zIndex);
    });
  }, [index, positions, getPosition]);

  // повідомляємо батьківський компонент про зміну активного слайда
  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % data.length);
  }, []);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  }, []);

  const handleGoTo = useCallback((i) => {
    setIndex(((i % data.length) + data.length) % data.length);
  }, []);

  // методи, доступні батьківському компоненту через ref
  useImperativeHandle(ref, () => ({
    next: handleNext,
    prev: handlePrev,
    goTo: handleGoTo,
  }));

  // автопрокрутка

  return (
    <div className={styles.carousel}>
      <div className={styles.wrapper}>
        {data.map((card, i) => (
          <div
            className={styles.card}
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                fill
                sizes="(max-width: 768px) 90vw, (min-width: 768px) and (max-width: 1023px) 90vw, 45vw"
                src="/image.png"
                alt="main-image"
              />
            </div>

            {characters.map((character) => (
              <div className={styles.character} key={character.character}>
                <div className={styles.leftCharacter}>
                  {character.character}
                </div>
                <div className={styles.rightCharacter}>{character.label}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default ApartmentsCarousel;
