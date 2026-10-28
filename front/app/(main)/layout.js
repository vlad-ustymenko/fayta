import qs from "qs";
import { headers } from "next/headers";
import { SidebarProvider } from "@/context/SidebarContext";
import { MenuProvider } from "@/context/MenuContext";
import { LenisProvider } from "@/context/LenisContext";
import { ModalProvider } from "@/context/ModalContext";

import Header from "@/src/components/Header/Header";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import Menu from "@/src/components/Menu/Menu";
import FooterWithKey from "@/src/components/Footer/FooterWithKey";
import ScrollToHash from "@/src/components/ScrollToHash/ScrollToHash";
import Modal from "@/src/components/Modal/Modal";

import { GoogleTagManager } from "@next/third-parties/google";

async function getLayoutData(locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale,
      populate: {
        blocks: {
          on: {
            "blocks.header": {
              populate: {
                menuLinks: { populate: "*" },
                logo: { fields: ["url"] },
              },
            },

            "blocks.sidebar": {
              populate: "*",
            },

            "blocks.menu": {
              populate: "*",
            },

            "blocks.modal": {
              populate: {
                socialIcons: {
                  populate: "*",
                },
              },
            },

            "blocks.footer": {
              populate: {
                leftBlock: {
                  populate: "*",
                },
                rightBlock: {
                  populate: "*",
                },
                icon: {
                  fields: ["url"],
                },
                socialIcons: {
                  populate: "*",
                },
                policy: {
                  populate: "*",
                },
              },
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  );

  const url = new URL(process.env.HOME_URL, baseUrl);
  url.search = query;

  try {
    const res = await fetch(url.href, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      console.error(`Strapi error: ${res.status} ${res.statusText}`);

      return null;
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export default async function MainLayout({ children }) {
  const headersList = await headers();

  const pathname = headersList.get("x-pathname") || "/";

  const locale = pathname.startsWith("/en") ? "en" : "uk";

  const strapiData = await getLayoutData(locale);

  const header = strapiData?.blocks.find(
    (block) => block.__component === "blocks.header",
  );

  const sidebar = strapiData?.blocks.find(
    (block) => block.__component === "blocks.sidebar",
  );

  const menu = strapiData?.blocks.find(
    (block) => block.__component === "blocks.menu",
  );

  const footer = strapiData?.blocks.find(
    (block) => block.__component === "blocks.footer",
  );

  const modal = strapiData?.blocks.find(
    (block) => block.__component === "blocks.modal",
  );

  return (
    <>
      <LenisProvider>
        <MenuProvider>
          <SidebarProvider>
            <ModalProvider>
              <ScrollToHash />

              <Header data={header} />

              {children}

              <FooterWithKey data={footer} />

              <Sidebar data={sidebar} locale={locale} />

              <Menu data={menu?.menuLinks} />

              <Modal data={modal} />
            </ModalProvider>
          </SidebarProvider>
        </MenuProvider>
      </LenisProvider>

      <GoogleTagManager gtmId="GTM-T29TVZS2" />
    </>
  );
}
