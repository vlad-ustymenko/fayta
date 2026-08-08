// components/ImageSlider/ImageSlider.jsx
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "@/context/LenisContext";
import styles from "./ImageSlider.module.css";

// slides підтримує 3 формати:
// [{ title: string, description: string, image: string }]  - з заголовком та описом
// [{ title: string, image: string }]                       - лише заголовок
// [{ url: string }]                                         - лише картинка
export default function ImageSlider({ data = [] }) {
  const sectionRef = useRef(null);
  const sliderImagesRef = useRef(null);
  const sliderTitleRef = useRef(null);
  const sliderIndicesRef = useRef(null);
  const progressBarRef = useRef(null);

  // ЗМІНЕНО: Lenis більше не створюється тут - береться зі спільного контексту,
  // щоб на сторінці існував лише ОДИН інстанс Lenis (LenisProvider у layout.jsx)
  const lenis = useLenis();

  // Приводимо усі формати до єдиної внутрішньої форми { image, title, description }
  const normalizedSlides = data.images.map((slide) => ({
    image: slide.image ?? slide.url,
    title: slide.title ?? null,
    description: slide.description ?? null,
  }));

  const hasText = normalizedSlides.some(
    (slide) => slide.title || slide.description,
  );

  useEffect(() => {
    // ДОДАНО: чекаємо, поки LenisProvider створить інстанс (перший рендер на
    // клієнті lenis === null, поки не відпрацює useEffect у провайдері)
    if (!normalizedSlides.length || !lenis) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // gsap.context прив'язує всі анімації/тригери до контейнера і дозволяє
    // прибрати їх ОДНИМ викликом revert() при розмонтуванні компонента -
    // це критично в Next.js, інакше ScrollTrigger-и накопичуються між переходами сторінок
    const ctx = gsap.context(() => {
      // ЗМІНЕНО: раніше тут створювався власний "new Lenis()" і власний тікер -
      // обидва прибрані, бо цим тепер керує LenisProvider глобально.
      // Залишається тільки підписка ScrollTrigger на скрол спільного інстансу.
      lenis.on("scroll", ScrollTrigger.update);

      const sliderImages = sliderImagesRef.current;
      const sliderTitle = sliderTitleRef.current;
      const sliderIndices = sliderIndicesRef.current;
      const progressBar = progressBarRef.current;

      let activeSlide = 0;
      let currentTitleSplit = null;
      let currentDescriptionSplit = null;

      function createIndices() {
        sliderIndices.innerHTML = "";

        normalizedSlides.forEach((_, index) => {
          const indexNum = (index + 1).toString().padStart(2, "0");
          const indicatorElement = document.createElement("p");
          indicatorElement.dataset.index = index;
          indicatorElement.innerHTML = `<span class="${styles.marker}"></span><span class="${styles.index}">${indexNum}</span>`;

          sliderIndices.appendChild(indicatorElement);

          if (index === 0) {
            gsap.set(indicatorElement.querySelector(`.${styles.index}`), {
              opacity: 1,
            });
            gsap.set(indicatorElement.querySelector(`.${styles.marker}`), {
              scaleX: 1,
            });
          } else {
            gsap.set(indicatorElement.querySelector(`.${styles.index}`), {
              opacity: 0.35,
            });
            gsap.set(indicatorElement.querySelector(`.${styles.marker}`), {
              scaleX: 0,
            });
          }
        });
      }

      function animateIndicators(index) {
        const indicators = sliderIndices.querySelectorAll("p");

        indicators.forEach((indicator, i) => {
          const markerElement = indicator.querySelector(`.${styles.marker}`);
          const indexElement = indicator.querySelector(`.${styles.index}`);

          if (i === index) {
            gsap.to(indexElement, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(markerElement, {
              scaleX: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            gsap.to(indexElement, {
              opacity: 0.5,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(markerElement, {
              scaleX: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      }

      // Розбиває елемент на рядки через SplitText і анімує їх появу.
      // delay використовується, щоб опис з'являвся трохи пізніше за заголовок.
      function splitAndAnimate(element, delay = 0) {
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
          duration: 0.75,
          stagger: 0.1,
          delay,
          ease: "power3.out",
        });

        return split;
      }

      function animateNewText(index) {
        // якщо ні title, ні description немає в жодному слайді - блок узагалі
        // не рендериться в JSX (див. hasText), і sliderTitle буде null
        if (!sliderTitle) return;

        if (currentTitleSplit) currentTitleSplit.revert();
        if (currentDescriptionSplit) currentDescriptionSplit.revert();
        currentTitleSplit = null;
        currentDescriptionSplit = null;

        const { title, description } = normalizedSlides[index];

        let html = "";
        if (title) html += `<h2>${title}</h2>`;
        if (description)
          html += `<p class="${styles.description}">${description}</p>`;
        sliderTitle.innerHTML = html;

        const titleEl = sliderTitle.querySelector("h2");
        const descriptionEl = sliderTitle.querySelector(
          `.${styles.description}`,
        );

        if (titleEl) {
          currentTitleSplit = splitAndAnimate(titleEl, 0);
        }

        // якщо є і заголовок, і опис - опис з'являється з невеликою затримкою після заголовка
        if (descriptionEl) {
          currentDescriptionSplit = splitAndAnimate(
            descriptionEl,
            titleEl ? 0.15 : 0,
          );
        }
      }

      function animateNewSlide(index) {
        const newSliderImage = document.createElement("img");
        // ВИПРАВЛЕНО: раніше тут не було префіксу NEXT_PUBLIC_STRAPI_BASE_URL,
        // через що всі слайди, крім першого (який рендериться через next/image
        // в JSX з правильним префіксом), не завантажувались
        newSliderImage.src = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${normalizedSlides[index].image}`;
        newSliderImage.alt =
          normalizedSlides[index].title || `Slide #${index + 1}`;

        gsap.set(newSliderImage, {
          opacity: 0,
          scale: 1.1,
        });

        sliderImages.appendChild(newSliderImage);

        gsap.to(newSliderImage, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });

        const allImages = sliderImages.querySelectorAll("img");
        if (allImages.length > 3) {
          const removeCount = allImages.length - 3;
          for (let i = 0; i < removeCount; i++) {
            sliderImages.removeChild(allImages[i]);
          }
        }

        animateNewText(index);
        animateIndicators(index);
      }

      createIndices();
      animateNewText(0);

      const pinDistance = window.innerHeight * normalizedSlides.length;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        pin: true,
        scrub: 1,
        pinSpacing: true,

        onUpdate: (self) => {
          gsap.set(progressBar, {
            scaleY: self.progress,
          });

          const currentSlide = Math.floor(
            self.progress * normalizedSlides.length,
          );

          if (
            activeSlide !== currentSlide &&
            currentSlide < normalizedSlides.length
          ) {
            activeSlide = currentSlide;
            animateNewSlide(activeSlide);
          }
        },
      });

      // ЗМІНЕНО: замість lenis.destroy() (бо інстанс тепер спільний і належить
      // провайдеру) - просто відписуємось від його події скролу
      return () => {
        lenis.off("scroll", ScrollTrigger.update);
      };
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.images, lenis]);

  return (
    <section className={styles.slider} ref={sectionRef}>
      <div className={styles.sliderImages} ref={sliderImagesRef}>
        {normalizedSlides[0] && (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${normalizedSlides[0].image}`}
            alt={normalizedSlides[0].title || "Slide #1"}
          />
        )}
      </div>

      {/* Блок тексту рендериться лише якщо хоч у одного слайду є title АБО description */}
      {hasText && (
        <div className={styles.sliderTitle} ref={sliderTitleRef}>
          {normalizedSlides[0]?.title && <h2>{normalizedSlides[0].title}</h2>}
          {normalizedSlides[0]?.description && (
            <p className={styles.description}>
              {normalizedSlides[0].description}
            </p>
          )}
        </div>
      )}

      <div className={styles.sliderIndicator}>
        <div className={styles.sliderIndices} ref={sliderIndicesRef}></div>
        <div className={styles.sliderProgressBar}>
          <div className={styles.sliderProgress} ref={progressBarRef}></div>
        </div>
      </div>
    </section>
  );
}
