import { createBrowserRouter, Navigate, type LoaderFunction, useLocation } from 'react-router-dom';

import { lazy, Suspense } from 'react';

import { useLangStore } from '@/stores/languageStore';
import { SUPPORTED_LANGS, SupportedLang, withLangPath } from '@/utils/langRouting';

import Layout from './pages/Layout';
import PrivateRoutes from './pages/PrivateRoutes';

// ⚡ Lazy Pages
const MainPage = lazy(() => import('./pages/landing/MainPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const Cart = lazy(() => import('./pages/cart/Cart'));
const Auth = lazy(() => import('./pages/auth/Auth'));

const Faq = lazy(() => import('./pages/Static/faq/Faq'));
const AboutUs = lazy(() => import('./pages/Static/AboutUs/AboutUs'));
const ContactUs = lazy(() => import('./pages/Static/ContactUs/ContactUs'));
const ReturnPolicy = lazy(() => import('./pages/Static/ReturnPolicy/ReturnPolicy'));

const ProductDetail = lazy(() => import('./pages/shop/Product-Detail/ProductDetail'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const CategoriesPage = lazy(() => import('./pages/shop/Categories/CategoriesPage'));
const ProductsFilterPage = lazy(() => import('./pages/shop/Products/ProductsFilterPage'));

const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));

const PaymentPage = lazy(() => import('./pages/checkout/PaymentPage'));
const PaymentFailurePage = lazy(() => import('./pages/checkout/PaymentFailurePage'));
const PaymentSuccessPage = lazy(() => import('./pages/checkout/PaymentSuccessPage'));

const ErrorPage = lazy(() => import('./pages/error/ErrorPage'));

/* ---------------- Layout wrappers ---------------- */

function LayoutWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <Layout />
    </Suspense>
  );
}

function ErrorBoundary() {
  return (
    <Suspense fallback={<div></div>}>
      <Layout>
        <ErrorPage />
      </Layout>
    </Suspense>
  );
}

/* ---------------- Language redirect ---------------- */

function RedirectToPreferredLanguage() {
  const lang = useLangStore((s) => s.lang);
  return <Navigate to={`/${lang}`} replace />;
}

function RedirectToLocalizedPath() {
  const location = useLocation();
  const lang = useLangStore((s) => s.lang);

  const destination = withLangPath(`${location.pathname}${location.search}${location.hash}`, lang);

  return <Navigate to={destination} replace />;
}

/* ---------------- Routes ---------------- */

const getPublicChildren = () => [
  { index: true, element: <MainPage /> },
  { path: 'auth', element: <Auth /> },
  { path: 'categories', element: <CategoriesPage /> },
  { path: 'products', element: <ProductsFilterPage /> },
  { path: 'products/:slug', element: <ProductDetail /> },
  { path: 'blogs', element: <BlogListPage /> },
  { path: 'blogs/:slug', element: <BlogPage /> },
  { path: 'cart', element: <Cart /> },
  { path: 'faq', element: <Faq /> },
  { path: 'about-us', element: <AboutUs /> },
  { path: 'contact-us', element: <ContactUs /> },
  { path: 'return-policy', element: <ReturnPolicy /> },
];

const getPrivateChildren = () => [
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'payment', element: <PaymentPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'payment/success', element: <PaymentSuccessPage /> },
  { path: 'payment/failure', element: <PaymentFailurePage /> },
];

const notFoundLoader: LoaderFunction = () => {
  throw new Response('Not Found', { status: 404 });
};

function createLocalizedBranch(lang: SupportedLang) {
  return {
    path: `/${lang}`,
    element: <LayoutWrapper />,
    errorElement: <ErrorBoundary />,
    children: [
      ...getPublicChildren(),
      {
        element: <PrivateRoutes />,
        children: getPrivateChildren(),
      },
      {
        path: '*',
        loader: notFoundLoader,
        element: <ErrorPage />,
      },
    ],
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RedirectToPreferredLanguage />,
  },
  ...SUPPORTED_LANGS.map(createLocalizedBranch),
  {
    path: '*',
    element: <RedirectToLocalizedPath />,
  },
]);
