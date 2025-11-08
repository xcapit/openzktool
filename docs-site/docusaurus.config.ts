import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenZKTool',
  tagline: 'Privacy infrastructure for Stellar Soroban using Zero-Knowledge Proofs',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://xcapit.github.io',
  // For GitHub pages deployment
  baseUrl: '/openzktool/',

  // GitHub pages deployment config
  organizationName: 'xcapit',
  projectName: 'openzktool',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/xcapit/openzktool/tree/main/docs-site/',
          showLastUpdateTime: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/openzktool-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenZKTool',
      logo: {
        alt: 'OpenZKTool Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/xcapit/openzktool',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
          label: 'Live Contract',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Stellar Integration',
              to: '/docs/stellar-integration/overview',
            },
            {
              label: 'Circuit Templates',
              to: '/docs/circuit-templates/kyc-transfer',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/xcapit/openzktool/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/xcapit_',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/xcapit/openzktool',
            },
            {
              label: 'Stellar Soroban',
              href: 'https://soroban.stellar.org/',
            },
            {
              label: 'Circom',
              href: 'https://docs.circom.io/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Xcapit Labs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['rust', 'solidity', 'typescript', 'bash'],
    },
    algolia: {
      // Placeholder - will need to be configured later
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'openzktool',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
