import { LOCALES } from "@/src/config/locales";

export const getLocaleFromPathname = (pathname) => {
  if (!pathname) return null;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  return LOCALES.includes(first) ? first : null;
};

export const getHomePath = (pathname) => {
  const locale = getLocaleFromPathname(pathname);
  return locale ? `/${locale}` : "/";
};

export const buildNavHref = (link, pathname) => {
  if (!link) return "#";

  const locale = getLocaleFromPathname(pathname);
  const homePath = getHomePath(pathname);
  const isHome = pathname === homePath;

  if (link.startsWith("#")) {
    return isHome ? link : `${homePath}${link}`;
  }

  if (link.startsWith("/") && locale && !link.startsWith(`/${locale}`)) {
    return `/${locale}${link}`;
  }

  // blockID без "#" — теж має вести на головну, якщо ми не на ній
  return isHome ? `#${link}` : `${homePath}#${link}`;
};
