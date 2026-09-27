import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Footer } from '@/components/layout/footer/Footer';
import useCart from '@/hooks/cart/useCart';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav/MobileBottomNav';
import { ReactNode, useEffect } from 'react';
import { useLangStore } from '@/stores/languageStore';
import { isSupportedLang, stripLangPrefix } from '@/utils/langRouting';
import { NavbarWithDropDownDrawer } from '@/components/layout/navbar/NavbarWithDropDownDrawer';
import GoftinoWidget from '@/components/layout/Goftino/GoftinoWidget';
import { SeoManager } from '@/seo/SeoManager';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  useCart();

  const basePath = stripLangPrefix(location.pathname);

  const isCheckoutOrPaymentPage =
    basePath === '/checkout' ||
    basePath.startsWith('/checkout/') ||
    basePath === '/payment' ||
    basePath.startsWith('/payment/');

  const isProductDetailPage = /^\/products\/[^/]+$/.test(basePath);

  const isPaymentResultPage = basePath === '/payment/success' || basePath === '/payment/failure';

  const hideGoftinoWidget =
    basePath === '/cart' || basePath.startsWith('/cart/') || isCheckoutOrPaymentPage;

  const hideNavAndFooter = basePath === '/auth' || isPaymentResultPage;

  const showMobileBottomNav = !hideNavAndFooter && !isProductDetailPage && !isCheckoutOrPaymentPage;

  const shouldReserveBottomSpace = showMobileBottomNav || isProductDetailPage;

  useEffect(() => {
    const pathLang = location.pathname.split('/').filter(Boolean)[0];

    if (isSupportedLang(pathLang) && pathLang !== lang) {
      setLang(pathLang);
    }
  }, [lang, location.pathname, setLang]);

  return (
    <>
      <SeoManager />

      {!hideNavAndFooter && <NavbarWithDropDownDrawer />}

      <div className={shouldReserveBottomSpace ? 'pb-28 lg:pb-0' : undefined}>
        {children ?? <Outlet />}
      </div>

      <GoftinoWidget isHidden={hideGoftinoWidget} />

      {!hideNavAndFooter && <Footer />}

      {showMobileBottomNav && <MobileBottomNav />}

      <ScrollRestoration />
    </>
  );
};

export default Layout;
