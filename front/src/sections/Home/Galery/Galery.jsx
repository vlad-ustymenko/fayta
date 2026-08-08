import React from "react";
import ImageSlider from "@/src/components/ImageSlider/ImageSlider";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./Galery.module.css";

const Galery = ({ data }) => {
  return (
    <div className={styles.galery}>
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
      <ImageSlider data={data}></ImageSlider>
    </div>
  );
};

export default Galery;
