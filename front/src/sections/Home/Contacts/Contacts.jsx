import React from "react";
import Form from "../../../components/Form/Form";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import { getSocialIcon } from "../../../utils/socialIcons";
import Image from "next/image";
import styles from "./Contacts.module.css";

const Contacts = ({ data }) => {
  return (
    <div className={styles.contacts} id="contacts">
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      />
      <div className={styles.contentWrapper}>
        <div className={styles.leftBlock}>
          {data.contactsInfo.map((item) => {
            switch (item.type) {
              case "phone":
                return (
                  <div key={item.id} className={styles.infoWrapper}>
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a href={`tel:${item.text}`} className={styles.infoText}>
                      {item.text}
                    </a>
                  </div>
                );
              case "email":
                return (
                  <div key={item.id} className={styles.infoWrapper}>
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a
                      href={`mailto:info@${item.text}`}
                      className={styles.infoText}
                    >
                      {item.text}
                    </a>
                  </div>
                );
              case "address":
                return (
                  <div
                    key={item.id}
                    className={
                      item.type === "address"
                        ? `${styles.infoWrapper} ${styles.infoWrapperAddress}`
                        : `${styles.infoWrapper}`
                    }
                  >
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a
                      href={data.googleMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoText}
                    >
                      {item.text}
                    </a>
                  </div>
                );
            }
          })}
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3731.8895175050134!2d22.2660837185108!3d48.59367839555191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4739191f9f854025%3A0x8ce402365ce544bc!2z0LLRg9C7LiDQpNC10YDQtdC90YbQsCDQodC10LzQsNC90LAsINCc0LjQvdCw0LksINCX0LDQutCw0YDQv9Cw0YLRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgODk0MjQ!5e0!3m2!1sru!2sua!4v1789325211938!5m2!1sru!2sua"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
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
          <h2 className={styles.rightBlockTitle}>{data.rightBlockTitle}</h2>
          <Form
            form={data.form}
            button={data.button}
            confidentialText={data.confidentialText}
            feedback
          ></Form>
          <div className={styles.socialText}>{data.socialText}</div>
          <div className={styles.socialWrapper}>
            {data.socialIcons?.map((icon) => {
              const Icon = getSocialIcon(icon.title);
              if (!Icon) return null;

              return (
                <a
                  key={icon.id}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Icon
                    className={
                      icon.title === "facebook"
                        ? `${styles.iconFacebook} ${styles.icon}`
                        : styles.icon
                    }
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
