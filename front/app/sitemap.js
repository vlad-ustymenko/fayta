const SITE_URL = "https://faytanova.com.ua";
const STRAPI_URL = process.env.STRAPI_BASE_URL;

const fetchFromStrapi = async (endpoint) => {
  try {
    const response = await fetch(`${STRAPI_URL}${endpoint}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        `Sitemap: Strapi request failed: ${response.status} ${response.statusText}`,
      );

      return [];
    }

    const result = await response.json();

    return result.data || [];
  } catch (error) {
    console.error("Sitemap: Strapi request error:", error);

    return [];
  }
};

const createUrl = (path) => `${SITE_URL}${path}`;

export default async function sitemap() {
  const [news, buildings] = await Promise.all([
    fetchFromStrapi("/api/news-cards?fields[0]=slug&pagination[pageSize]=1000"),
    fetchFromStrapi(
      "/api/building-cards?fields[0]=slug&pagination[pageSize]=1000",
    ),
  ]);

  const staticPages = [
    {
      path: "/",
      priority: 1,
    },
    {
      path: "/about",
      priority: 0.8,
    },
    {
      path: "/apartments",
      priority: 0.9,
    },
    {
      path: "/building",
      priority: 0.8,
    },
    {
      path: "/news",
      priority: 0.8,
    },
    {
      path: "/en",
      priority: 1,
    },
    {
      path: "/en/about",
      priority: 0.8,
    },
    {
      path: "/en/apartments",
      priority: 0.9,
    },
    {
      path: "/en/building",
      priority: 0.8,
    },
    {
      path: "/en/news",
      priority: 0.8,
    },
  ];

  const staticUrls = staticPages.map(({ path, priority }) => ({
    url: createUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));

  const newsUrls = news.flatMap((item) => {
    const slug = item.slug;

    if (!slug) return [];

    return [
      {
        url: createUrl(`/news/${slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: createUrl(`/en/news/${slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
    ];
  });

  const buildingUrls = buildings.flatMap((item) => {
    const slug = item.slug;

    if (!slug) return [];

    return [
      {
        url: createUrl(`/building/${slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: createUrl(`/en/building/${slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ];
  });

  return [...staticUrls, ...newsUrls, ...buildingUrls];
}
