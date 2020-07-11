module.exports = {
  title: "Rows n' Columns",
  tagline: "React Components for Tabular Data",
  url: "https://rowsncolumns.app",
  baseUrl: "/",
  favicon: "/favicon-32x32.png",
  organizationName: "rowsncolumns", // Usually your GitHub org/user name.
  projectName: "grid", // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    // sidebarCollapsible: false,
    prism: {
      theme: require("prism-react-renderer/themes/dracula"),
    },
    navbar: {
      title: "Rows n' Columns",
      logo: {
        alt: "Rows n' Columns",
        src: "img/logo.png",
      },
      links: [
        // {to: '/features', label: 'Features', position: 'left'},
        // {to: '/demo', label: 'Demo', position: 'left'},
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Documentation",
          position: "left",
        },
        { to: "pricing", label: "Pricing", position: "left" },
        { to: "contact", label: "Contact", position: "left" },
        {
          href: "https://discord.gg/K4cNVh6",
          label: "Chat",
          position: "right",
        },
        {
          href: "https://github.com/rowsncolumns",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "What is Spreadsheet",
              to: "/docs",
            },
            {
              label: "Examples",
              to: "docs/sizing",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/K4cNVh6",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/rowncolumnsapp",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Privacy policy",
              to: "/privacy",
            },
            {
              label: "Terms of use",
              to: "/terms-of-use",
            },
            {
              label: "GitHub",
              href: "https://github.com/rowsncolumns",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Rows n' Columns. Made in Sunny Singapore.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: "introduction",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/rowsncolumns/grid/edit/master/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/rowsncolumns/grid/edit/master/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-sitemap",
      {
        cacheTime: 600 * 1000, // 600 sec - cache purge period
        changefreq: "weekly",
        priority: 0.5,
      },
    ],
  ],
};
