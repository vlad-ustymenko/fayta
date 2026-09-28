"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import styles from "./MaskedMedia.module.css";

const MaskedMedia = forwardRef(function MaskedMedia(
  { src, mime, logoSrc, poster, alt = "", className = "" },
  ref,
) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

  const mediaUrl = `${baseUrl}${src}`;
  const logoUrl = `${baseUrl}${logoSrc}`;

  const isVideo = mime?.startsWith("video/");

  const maskStyle = {
    WebkitMaskImage: `url(${logoUrl})`,
    maskImage: `url(${logoUrl})`,
  };

  return (
    <div ref={ref} className={`${styles.container} ${className}`}>
      {isVideo ? (
        <video
          className={styles.maskedMedia}
          style={maskStyle}
          src={mediaUrl}
          poster={poster ? `${baseUrl}${poster}` : undefined}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={mediaUrl}
          alt={alt}
          fill
          sizes="100vw"
          className={styles.maskedMedia}
          style={maskStyle}
        />
      )}
    </div>
  );
});

export default MaskedMedia;
