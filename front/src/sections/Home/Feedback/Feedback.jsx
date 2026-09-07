import React from "react";
import Form from "../../../components/Form/Form";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import styles from "./Feedback.module.css";

const Feedback = ({ data }) => {
  return (
    <div className={styles.feedback}>
      <div className={styles.leftBlock}>
        <p className={styles.leftBlockName}>{data.leftBlockName}</p>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <h1 className={styles.leftBlockTitle}>{children}</h1>
            ),
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {data.leftBlockTitle}
        </ReactMarkdown>
        <p className={styles.leftBlockText}>{data.leftBlockText}</p>
        <p className={styles.phoneTitle}>{data.phoneTitle}</p>
        <a href={`tel:${data.phone}`} className={styles.phone}>
          {data.phone}
        </a>
      </div>
      <div className={styles.rightBlock}>
        <div className={styles.imageWrapper}>
          <Image
            src="/backImage.png"
            alt="image"
            fill
            className={styles.image}
          ></Image>
        </div>
        <p className={styles.rightBlockName}>{data.rightBlockName}</p>
        <h2 className={styles.rightBlockTitle}>{data.rightBlockTitle}</h2>
        <Form
          form={data.form}
          button={data.button}
          confidentialText={data.confidentialText}
          feedback
        ></Form>
      </div>
    </div>
  );
};

export default Feedback;
