import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import { AiFillEye } from "react-icons/ai";
import styles from "./Documentation.module.css";

const Documentation = ({ data }) => {
  return (
    <div className={styles.documentation}>
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
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

      <div className={styles.docGrid}>
        {data.doc.map((item) => (
          <div key={item.title} className={styles.docItemWrapper}>
            <div className={styles.docItemText}>{item.title}</div>
            <AiFillEye className={styles.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentation;
