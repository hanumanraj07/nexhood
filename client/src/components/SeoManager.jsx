import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'NexHood';
const SITE_URL = 'https://nexhood.vercel.app';
const DEFAULT_TITLE = 'NexHood | Data-Driven Real Estate Intelligence';
const DEFAULT_DESCRIPTION =
  'NexHood helps buyers, renters, and investors make smarter property decisions using neighborhood analytics, risk insights, and urban intelligence.';

const ROUTE_SEO = [
  {
    match: (path) => path === '/',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    robots: 'index, follow',
  },
  {
    match: (path) => path === '/signin',
    title: 'Sign In | NexHood',
    description: 'Sign in to access your NexHood dashboard and real estate intelligence workspace.',
    robots: 'noindex, nofollow',
  },
  {
    match: (path) => path === '/signup',
    title: 'Create Account | NexHood',
    description: 'Create your NexHood account to unlock neighborhood and investment intelligence tools.',
    robots: 'noindex, nofollow',
  },
  {
    match: (path) => path.startsWith('/dashboard'),
    title: 'Dashboard | NexHood',
    description: 'NexHood intelligence dashboard for neighborhood, parking, risk, and operations insights.',
    robots: 'noindex, nofollow',
  },
];

const getRouteMeta = (pathname) =>
  ROUTE_SEO.find((entry) => entry.match(pathname)) || {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    robots: 'index, follow',
  };

const upsertMeta = (name, content, attr = 'name') => {
  if (!content) return;
  const selector = `meta[${attr}="${name}"]`;
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, name);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    document.head.appendChild(node);
  }
  node.setAttribute('href', href);
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const { title, description, robots } = getRouteMeta(location.pathname);
    const canonical = `${SITE_URL}${location.pathname}`;

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', robots);

    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:site_name', SITE_NAME, 'property');
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('og:image', `${SITE_URL}/vite.svg`, 'property');

    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', `${SITE_URL}/vite.svg`);

    upsertLink('canonical', canonical);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
