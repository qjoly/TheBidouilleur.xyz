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
  organizationName: 'QJoly', // Usually your GitHub org/user name.
  projectName: 'TheBidouilleur', // Usually your repo name.
  scripts: [{src: 'https://stats.192168128.xyz/js/script.js', defer: true, 'data-domain': 'thebidouilleur.xyz'}],
  plugins: [require.resolve("@cmfcmf/docusaurus-search-local")],

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
          editUrl: 'https://github.com/QJoly/TheBidouilleur.xyz/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          editUrl:
            'https://github.com/QJoly/TheBidouilleur.xyz/tree/main/',
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
      image: '/img/BMO.png',
      metadata: [{
        name: 'twitter:card', content: 'summary'
      }],
      defaultMode: 'dark',
      
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
            href: 'https://github.com/qjoly',
            label: 'Git',
            position: 'left',
          },
          {
            href: 'https://twitter.com/thebidouilleur',
            label: 'Twitter',
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
            title: 'Me Suivre',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/TheBidouilleur',
              },
              {
                label: 'Flux RSS',
                href: 'https://thebidouilleur.xyz/blog/rss.xml',
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
                href: 'https://github.com/qjoly',
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
