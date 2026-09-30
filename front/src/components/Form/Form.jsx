"use client";

import React from "react";
import IMask from "imask";
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../Button/Button";
import styles from "./Form.module.css";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import { useModal } from "@/context/ModalContext";

const Form = ({
  form,
  button,
  confidentialText,
  feedback,
  className,
  loaderText,
  locale,
}) => {
  const phoneInputRef = useRef(null);
  const { openModal, setSending, setIsForm } = useModal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (phoneInputRef.current) {
      const mask = IMask(phoneInputRef.current, {
        mask: "+38 (000) 000-00-00",
      });

      mask.on("accept", () => {
        setValue("phone", mask.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      return () => mask.destroy();
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    openModal({ loaderText });
    setSending(true);

    setTimeout(() => {
      console.log("Form sending finished");
      setSending(false);
      reset();
    }, 3000);
  };

  const privacyUrl = locale === "en" ? "/en/privacy" : "/privacy";

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {form.map((item) => (
          <Controller
            key={item.id}
            name={item.type}
            control={control}
            rules={{
              required: {
                value: true,
                message: item.emptyDataErr,
              },
              validate:
                item.type === "name"
                  ? (value) =>
                      /^[\p{L}\s'-]+$/u.test(value.trim()) ||
                      item.unvalidDataErr
                  : item.type === "phone"
                    ? (value) =>
                        /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value) ||
                        item.unvalidDataErr
                    : undefined,
            }}
            render={({ field }) => (
              <div className={styles.inputWrapper}>
                <input
                  {...field}
                  type={item.type === "phone" ? "tel" : "text"}
                  className={styles.input}
                  placeholder=" "
                  id={item.type}
                  ref={(el) => {
                    field.ref(el);

                    if (item.type === "phone") {
                      phoneInputRef.current = el;
                    }
                  }}
                  style={{
                    borderBottom: errors[item.type] ? "2px solid red" : "",
                    color: feedback ? "var(--black)" : "",
                    WebkitTextFillColor: "white",
                  }}
                />

                <label
                  htmlFor={item.type}
                  className={styles.floatingLabel}
                  style={{
                    color: feedback ? "var(--black)" : "",
                  }}
                >
                  {item.placeholder}
                </label>

                <p className={styles.errorMessage}>
                  {errors[item.type]?.message || "\u00A0"}
                </p>
              </div>
            )}
          />
        ))}

        <Button
          title={button}
          form
          className={feedback ? styles.feedbackButton : styles.button}
        />

        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => <p className={styles.subtitle}>{children}</p>,
            strong: ({ children }) => (
              <a
                href={privacyUrl}
                className={styles.link}
                style={{
                  borderBottom: feedback ? "0.1vw solid var(--secondary)" : "",
                  color: feedback ? "var(--secondary)" : "",
                  fontFamily: "var(--font-sofia), sans-serif",
                }}
              >
                {children}
              </a>
            ),
          }}
        >
          {confidentialText}
        </ReactMarkdown>
      </form>
    </div>
  );
};

export default Form;
