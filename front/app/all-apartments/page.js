"use client";

import { useEffect, useRef } from "react";

const Page = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return;

    iframeDocument.open();
    iframeDocument.write(`
      <script>
        const REQUEST_URL = 'https://pro-api.flat.show/api/complex/website/index_html';
        let clientPageUrl = encodeURIComponent(window.parent.location.href);

        ;(() => {
          rewriteDocument('');

          document.addEventListener("DOMContentLoaded", () => {
            rewriteDocument('');
            getCurrentPage();
          });
        })();

        function getCurrentPage() {
          let xhr = new XMLHttpRequest();

          xhr.onerror = xhr.onload = function() {
            let html = this.responseText;

            if (this.status !== 200) {
              html = '<h1>' + this.status + '</h1>';
              setTimeout(getCurrentPage, 10000);
            }

            rewriteDocument('');
            rewriteDocument(html);
          };

          xhr.open('GET', REQUEST_URL + '?clientPageUrl=' + clientPageUrl);
          xhr.send();
        }

        function rewriteDocument(body) {
          document.open();
          document.write(body);
          document.close();
        }
      <\/script>
    `);
    iframeDocument.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Flat Show"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
    />
  );
};

export default Page;
