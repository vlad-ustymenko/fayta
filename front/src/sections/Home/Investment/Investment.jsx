import React from "react";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./Investment.module.css";

const Investment = ({ data }) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.investmentList[0].leftBlockIcon.url}`;

  return (
    <div className={styles.investment}>
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      ></BlockTitle>

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

      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => <p className={styles.description}>{children}</p>,
          strong: ({ children }) => (
            <span className={styles.strong}>{children}</span>
          ),
        }}
      >
        {data.description}
      </ReactMarkdown>

      <div className={styles.investmentList}>
        {/* Колонка 1: всі ліві блоки */}
        <div className={styles.leftBlock}>
          {data.investmentList.map((item) => (
            <p
              key={item.id}
              className={styles.leftBlockTitle}
              style={{ "--after-image": `url(${imageUrl})` }}
            >
              {item.leftBlockTitle}
            </p>
          ))}
        </div>

        {/* Колонка 2: всі праві блоки */}
        <div>
          {data.investmentList.map((item, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            return (
              <div className={styles.rightBlock} key={item.id}>
                <p
                  className={styles.rightBlockTitle}
                  style={{ "--index": `"${formattedIndex}"` }}
                >
                  {item.rightBlockTitle}
                </p>
                <p className={styles.rightBlockDescription}>
                  {item.rightBlockDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Investment;
