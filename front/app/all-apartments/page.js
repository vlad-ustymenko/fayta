"use client";

import { useEffect, useRef } from "react";

const Page = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return;

    const REQUEST_URL =
      "https://pro-api.flat.show/api/complex/website/index_html";

    const clientPageUrl = encodeURIComponent(window.location.href);

    let retryTimeout;

    const getCurrentPage = async () => {
      try {
        const response = await fetch(
          `${REQUEST_URL}?clientPageUrl=${clientPageUrl}`,
        );

        if (!response.ok) {
          iframeDocument.open();
          iframeDocument.write(`<h1>${response.status}</h1>`);
          iframeDocument.close();

          retryTimeout = setTimeout(getCurrentPage, 10000);
          return;
        }

        const html = await response.text();

        iframeDocument.open();
        iframeDocument.write(html);
        iframeDocument.close();
      } catch (error) {
        console.error("Не вдалося завантажити сторінку:", error);
        retryTimeout = setTimeout(getCurrentPage, 10000);
      }
    };

    getCurrentPage();

    return () => {
      clearTimeout(retryTimeout);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Flat Show"
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    />
  );
};

export default Page;
