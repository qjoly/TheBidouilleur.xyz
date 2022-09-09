const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */



(module.exports = {
  title: 'TheBidouilleur',
  tagline: 'Bienvenue dans ma vie faite de 0 et de 1 ! ',
  url: 'https://thebidouilleur.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Cinabre', // Usually your GitHub org/user name.
  projectName: 'TheBidouilleur', // Usually your repo name.
  i18n: 
  {
       defaultLocale: 'fr',
       locales: ['en', 'fr'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://git.thoughtless.eu/TheBidouilleur/Docausaurus',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          editUrl:
            'https://git.thoughtless.eu/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'TheBidouilleur',
        logo: {
          alt: 'TheBidouilleur',
          src: 'img/BMO.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/blog/archive', label: 'Archives', position: 'right'},
          {
            href: 'https://git.thoughtless.eu/Cinabre',
            label: 'Git',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/TheBidouilleur',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Archives',
                to: '/blog/archive',
              },
              {
                label: 'Git',
                href: 'https://git.thoughtless.eu',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TheBidouilleur.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
