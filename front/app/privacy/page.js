import qs from "qs";
import { notFound } from "next/navigation";
import { createMetadata } from "@/src/utils/seo";
import Privacy from "@/src/components/Privacy/Privacy";

async function getData(path) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: "uk",
      populate: {
        seo: {
          populate: {
            ogImage: { fields: ["url", "width", "height", "alternativeText"] },
          },
        },
        button: { populate: "*" },
      },
    },
    { encodeValuesOnly: true },
  );

  const url = new URL(path, baseUrl);
  url.search = query;

  try {
    const res = await fetch(url.href, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Strapi error: ${res.status} ${res.statusText}`);
      return;
    }

    const data = await res.json();
    return data.data;
  } catch {}
}

export async function generateMetadata() {
  const data = await getData(process.env.PRIVACY_URL, "uk");

  return createMetadata({
    seo: data?.seo || null,

    path: "/privacy",

    locale: "uk",

    alternatePaths: {
      uk: "/privacy",
      en: "/en/privacy",
    },
  });
}

export default async function Home() {
  const strapiData = await getData(process.env.PRIVACY_URL);

  if (!strapiData) {
    notFound();
  }

  return (
    <main>
      <Privacy data={strapiData}></Privacy>
    </main>
  );
}
