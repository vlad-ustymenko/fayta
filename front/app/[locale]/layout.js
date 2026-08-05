const metaByLocale = {
  uk: {
    title: "Pro-Group — Забудовник, якому довіряють родини в Києві та Ужгороді",
    description:
      "Ми будуємо житлові комплекси, в яких люди дійсно хочуть жити: Anthracite, ANTHRACITE PRO, Fayta Nova, Dimline. Тихі внутрішні двори, продумане планування та повний комплект юридичних документів — все для спокійного та безтурботного життя.",
    image: "/og_uk.jpg",
  },
  en: {
    title: "Pro-Group — The Developer Trusted by Families in Kyiv and Uzhhorod",
    description:
      "We build residential complexes people actually want to live in: Anthracite, ANTHRACITE PRO, Fayta Nova, Dimline. Quiet courtyards, thoughtful layouts, and a complete set of legal documents — everything for peaceful, worry-free living.",
    image: "/og_en.jpg",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const meta = metaByLocale[locale] || metaByLocale.uk;

  return {
    metadataBase: new URL("https://www.pro-group.com.ua/"),
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [{ url: meta.image }],
      locale: locale === "en" ? "en_US" : "uk_UA",
    },
    // twitter: {
    //   card: "summary_large_image",
    //   title: meta.title,
    //   description: meta.description,
    //   images: [meta.image],
    // },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return <body lang={locale}>{children}</body>;
}
