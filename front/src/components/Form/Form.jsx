"use client";

import { useRef, useEffect } from "react";
import IMask from "imask";
import { useForm, Controller } from "react-hook-form";
import Button from "../Button/Button";
import styles from "./Form.module.css";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import { useModal } from "@/context/ModalContext";
import { sendGTMEvent } from "@next/third-parties/google";

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
    const input = phoneInputRef.current;
    if (!input) return;

    let mask = null;

    const handleInput = () => {
      if (mask) {
        if (!mask.unmaskedValue) {
          mask.destroy();
          mask = null;

          input.value = "";

          setValue("phone", "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        return;
      }

      const digits = input.value.replace(/\D/g, "");

      if (digits.length && (digits[0] === "0" || digits[0] === "3")) {
        const firstDigit = digits[0];

        mask = IMask(input, {
          mask: "+38 (000) 000-00-00",
          lazy: false,
        });

        mask.on("accept", () => {
          setValue("phone", mask.value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        });

        mask.value = `+38 (${firstDigit}`;

        setValue("phone", mask.value, {
          shouldValidate: true,
          shouldDirty: true,
        });

        requestAnimationFrame(() => {
          input.setSelectionRange(6, 6);
        });
      }
    };

    input.addEventListener("input", handleInput);

    return () => {
      input.removeEventListener("input", handleInput);
      if (mask) mask.destroy();
    };
  }, [setValue]);

  const getUtmParams = () => {
    const cookies = document.cookie.split("; ");

    const result = {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    };

    cookies.forEach((cookie) => {
      const separatorIndex = cookie.indexOf("=");

      if (separatorIndex === -1) return;

      const key = cookie.slice(0, separatorIndex);
      const value = cookie.slice(separatorIndex + 1);

      if (key.startsWith("utm_") && key in result) {
        try {
          result[key] = decodeURIComponent(value);
        } catch {
          result[key] = value;
        }
      }
    });

    return result;
  };

  const onSubmit = async (data) => {
    const utm = getUtmParams();

    setSending(true);
    setIsForm(true);

    openModal({ loaderText });

    // ОКРЕМИЙ ЗАПИТ ДО CRM
    fetch("/api/crm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        lang: locale === "en" ? "en" : "ua",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_term: utm.utm_term,
        utm_content: utm.utm_content,
      }),
    })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "CRM API error");
        }

        console.log("CRM: form successfully sent");
      })
      .catch((error) => {
        console.error("CRM error:", error);
      });

    // ВІДПРАВЛЕННЯ В TELEGRAM — БЕЗ ЗМІН
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_term: utm.utm_term,
          utm_content: utm.utm_content,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send");
      }

      sendGTMEvent({
        event: "generate_lead",
        form_name: "contacts",
      });

      reset();
    } catch (error) {
      console.error("Telegram error:", error);
    } finally {
      setSending(false);
    }
  };

  const privacyUrl = locale === "en" ? "/en/privacy" : "/privacy";

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                  : undefined,
            }}
            render={({ field }) => (
              <div className={styles.inputWrapper}>
                <input
                  {...field}
                  type={item.type === "phone" ? "tel" : "text"}
                  autoComplete="off"
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
