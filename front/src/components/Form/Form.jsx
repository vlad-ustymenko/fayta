import React from "react";
import IMask from "imask";
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../Button/Button";
import styles from "./Form.module.css";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

// const data = [
//   {
//     title: "name",
//     placeholder: "Name",
//     emptyDataErr: "*введіть ім'я",
//     unvalidDataErr: "*має містити тільки букви",
//   },
//   {
//     title: "phone",
//     placeholder: "Phone",
//     emptyDataErr: "Введіть телефон",
//     unvalidDataErr: "*введіть коректний номер телефону",
//   },
// ];

const Form = ({ data }) => {
  const phoneInputRef = useRef(null);

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
    // try {
    //   setSending(true);
    //   const response = await fetch("/api/sendMail", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       name: data.name,
    //       phone: data.phone,
    //     }),
    //   });
    //   if (response.ok) {
    //     reset();
    //     setActiveCheckbox(false);
    //     setDepartmentOpen(false);
    //   }
    // } finally {
    //   setSending(false);
    // }
  };
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{data.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {data.form.map((item) => (
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
                    borderBottom: errors[item.title] ? "2px solid red" : "",
                  }}
                />
                <label htmlFor={item.type} className={styles.floatingLabel}>
                  {item.placeholder}
                </label>
                {errors[item.type] && (
                  <p className={styles.errorMessage}>
                    {errors[item.type].message}
                  </p>
                )}
              </div>
            )}
          />
        ))}
        <Button title={data.button} form className={styles.button}></Button>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => <p className={styles.subtitle}>{children}</p>,
            strong: ({ children }) => (
              <a href="#" className={styles.link}>
                {children}
              </a>
            ),
          }}
        >
          {data.confidentialText}
        </ReactMarkdown>
      </form>
    </div>
  );
};

export default Form;
