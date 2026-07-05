import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'JobFit AI',
  tagline: 'Match your resume to any role',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: process.env.DOCS_URL ?? 'http://localhost:3000',
  baseUrl: '/docs/',

  organizationName: 'jobfit-ai',
  projectName: 'jobfit-ai',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'JobFit AI',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: '/',
          label: 'Open app',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            { label: 'Getting started', to: '/getting-started/installation' },
            { label: 'User guide', to: '/user-guide/dashboard' },
            { label: 'Architecture', to: '/architecture/overview' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Agent tools', to: '/reference/agent-tools' },
            { label: 'Convex API', to: '/reference/convex-api' },
            { label: 'Environment variables', to: '/reference/environment-variables' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'FAQ', to: '/help/faq' },
            { label: 'Troubleshooting', to: '/help/troubleshooting' },
            { label: 'Open app', href: '/' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JobFit AI. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
