import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'generated-index' },
      items: ['getting-started/installation', 'getting-started/first-analysis'],
    },
    {
      type: 'category',
      label: 'User Guide',
      link: { type: 'generated-index' },
      items: [
        'user-guide/dashboard',
        'user-guide/analyze',
        'user-guide/resumes',
        'user-guide/analysis-report',
        'user-guide/tracker',
        'user-guide/compare',
        'user-guide/career-tools',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      link: { type: 'generated-index' },
      items: [
        'concepts/matching-scores',
        'concepts/authentication',
        'concepts/rate-limits',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: { type: 'generated-index' },
      items: [
        'architecture/overview',
        'architecture/agent-pipeline',
        'architecture/data-model',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: { type: 'generated-index' },
      items: [
        'reference/agent-tools',
        'reference/agent-skills',
        'reference/convex-api',
        'reference/environment-variables',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      link: { type: 'generated-index' },
      items: ['deployment/production', 'deployment/docs-site'],
    },
    {
      type: 'category',
      label: 'Help',
      link: { type: 'generated-index' },
      items: ['help/faq', 'help/troubleshooting'],
    },
  ],
};

export default sidebars;
