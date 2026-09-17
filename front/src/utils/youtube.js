// src/utils/youtube.js
export const getYoutubeEmbedUrl = (url, options = {}) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  );

  const videoId = match ? match[1] : null;
  if (!videoId) return null;

  const params = new URLSearchParams({
    controls: options.controls ?? "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    mute: options.autoplay ? "1" : "0",
    autoplay: options.autoplay ? "1" : "0",
    ...(options.loop && { loop: "1", playlist: videoId }),
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};
