import { createBrowserRouter, type LoaderFunction } from 'react-router';
import { lazy } from 'react';

import type { SupportedLang } from '@/utils/langRouting';

import Layout from './pages/Layout';
import PrivateRoutes from './pages/PrivateRoutes';
import MainPage from './pages/landing/MainPage';
import Cart from './pages/cart/Cart';
import CheckoutPage from './pages/checkout/CheckoutPage';
import PaymentPage from './pages/checkout/PaymentPage';

// ⚡ Lazy Pages
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const Auth = lazy(() => import('./pages/auth/Auth'));

const Faq = lazy(() => import('./pages/Static/faq/Faq'));
const AboutUs = lazy(() => import('./pages/Static/AboutUs/AboutUs'));
const ContactUs = lazy(() => import('./pages/Static/ContactUs/ContactUs'));
const ReturnPolicy = lazy(() => import('./pages/Static/ReturnPolicy/ReturnPolicy'));

const ProductDetail = lazy(() => import('./pages/shop/Product-Detail/ProductDetail'));
const CategoriesPage = lazy(() => import('./pages/shop/Categories/CategoriesPage'));
const ProductsFilterPage = lazy(() => import('./pages/shop/Products/ProductsFilterPage'));

const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));

const PaymentFailurePage = lazy(() => import('./pages/checkout/PaymentFailurePage'));
const PaymentSuccessPage = lazy(() => import('./pages/checkout/PaymentSuccessPage'));

const ErrorPage = lazy(() => import('./pages/error/ErrorPage'));


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
  { path: 'fa/payment/failure', element: <PaymentFailurePage /> },
  { path: 'fa/payment/success', element: <PaymentSuccessPage /> },
];

const getPrivateChildren = () => [
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'payment', element: <PaymentPage /> },
  { path: 'profile', element: <ProfilePage /> },
];

const notFoundLoader: LoaderFunction = () => {
  throw new Response('Not Found', { status: 404 });
};

function createLocalizedBranch(lang: SupportedLang) {
  return {
    path: lang === 'fa' ? '/' : `/${lang}`,
    element: <Layout />,
    errorElement: <ErrorPage />,
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
  createLocalizedBranch('fa'),
  // Restore this route when English pages are ready to publish.
  // createLocalizedBranch('en'),
]);
