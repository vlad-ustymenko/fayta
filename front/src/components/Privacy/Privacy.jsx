"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Button from "../Button/Button";
import styles from "./Privacy.module.css";

const Privacy = ({ data }) => {
  console.log(data);
  return (
    <div className={styles.privacy}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => <p className={styles.moreText}>{children}</p>,
          strong: ({ children }) => (
            <span className={styles.strong}>{children}</span>
          ),
          li: ({ children }) => <li className={styles.listItem}>{children}</li>,
        }}
      >
        {data.text}
      </ReactMarkdown>
      <div className={styles.buttonWrapper}>
        <Button
          title={data.button.title}
          link
          href={data.button.link}
          className={styles.button}
        />
      </div>
    </div>
  );
};

export default Privacy;
