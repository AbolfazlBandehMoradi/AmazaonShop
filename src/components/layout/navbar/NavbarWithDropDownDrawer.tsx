import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  CircleHelp,
  Grid2x2,
  Info,
  LogIn,
  LogOut,
  Menu,
  PackageSearch,
  Phone,
  ScrollText,
  Search,
  User2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MainLogo from '@/assets/Images/Logo/MainLogo.webp';
import { CartIcon } from '@/components/ui/CartIcon';
import { storeBrandName, storeContact } from '@/config/store';
import { ThemeToggleButton } from '@/components/ui/ThemeToggleButton';
import { useAuth } from '@/context/AuthContext';
import useCategories from '@/hooks/useCategories';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import useCartStore from '@/stores/cartStore';
import { useShopStore } from '@/stores/productsFilterStore';
import { stripLangPrefix } from '@/utils/langRouting';
import { cn } from '@/utils/cn';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

type CategoryItem = {
  id: string | number;
  name: string;
  children?: CategoryItem[];
};

const actionButtonClass =
  'relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1C1C1C] transition-colors hover:bg-first/10 hover:text-first focus-visible:ring-2 focus-visible:ring-first dark:bg-color-for-layer-sec dark:text-text';

export function NavbarWithDropDownDrawer() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const {
    data: categories,
    isPending: areCategoriesPending,
    isError: areCategoriesUnavailable,
  } = useCategories();
  const dir = useLangStore((store) => store.dir);
  const localizedPath = useLocalizedPath();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useCartStore((store) => store.itemCount);
  const setSearchText = useShopStore((store) => store.setSearch);
  const setCategoryIds = useShopStore((store) => store.setCategoryIds);
  const categoryList = (categories ?? []) as CategoryItem[];
  const basePath = stripLangPrefix(location.pathname);
  const isCategoryRoute = basePath.startsWith('/categories');
  const locationParams = new URLSearchParams(location.search);
  const activeSearch =
    basePath === '/products'
      ? (locationParams.get('search') ?? locationParams.get('q') ?? '').trim()
      : '';

  const [searchValue, setSearchValue] = useState(activeSearch);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerDirection, setDrawerDirection] = useState<'rtl' | 'ltr'>(dir);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState<string | number | null>(null);

  usePageScrollLock(isDrawerOpen);

  const desktopCategoryRef = useRef<HTMLLIElement>(null);
  const desktopCategoryButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerCloseButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const labels = {
    products: t('nav.products'),
    categories: t('nav.categories'),
    blog: t('nav.blog'),
    about: t('nav.about'),
    contact: t('nav.contact'),
    faq: t('nav.faq'),
    returnPolicy: t('nav.returnPolicy'),
    login: t('nav.login'),
    loginShort: t('nav.loginShort'),
    register: t('nav.register'),
    profile: t('nav.profile'),
    logout: t('nav.logout'),
    cart: t('nav.cart'),
    search: t('nav.searchPlaceholder') || t('nav.search'),
    clearSearch: t('nav.clearSearch'),
    all: t('nav.all'),
    openMenu: t('nav.openMenu'),
    closeMenu: t('nav.closeMenu'),
    menuTitle: t('nav.menuTitle'),
    navigationLabel: t('nav.navigationLabel'),
    mobileTagline: t('nav.mobileTagline'),
    support: t('nav.support'),
    categoriesLoading: t('nav.categoriesLoading'),
    categoriesUnavailable: t('nav.categoriesUnavailable'),
    noCategories: t('nav.noCategories'),
  };

  const activeCategory = categoryList[activeCategoryIndex] ?? categoryList[0];
  const userAvatar = user?.avatar?.filePath;
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || labels.profile;

  const navLinks = [
    {
      label: labels.products,
      to: localizedPath('/products'),
      matches: (path: string) => path.startsWith('/products'),
    },
    {
      label: labels.blog,
      to: localizedPath('/blogs'),
      matches: (path: string) => path.startsWith('/blogs'),
    },
    {
      label: labels.about,
      to: localizedPath('/about-us'),
      matches: (path: string) => path.startsWith('/about-us'),
    },
    {
      label: labels.contact,
      to: localizedPath('/contact-us'),
      matches: (path: string) => path.startsWith('/contact-us'),
    },
  ];

  const drawerLinks = [
    { label: labels.products, to: localizedPath('/products'), icon: PackageSearch },
    { label: labels.about, to: localizedPath('/about-us'), icon: Info },
    { label: labels.contact, to: localizedPath('/contact-us'), icon: Phone },
    { label: labels.faq, to: localizedPath('/faq'), icon: CircleHelp },
    { label: labels.returnPolicy, to: localizedPath('/return-policy'), icon: ScrollText },
  ];

  const navLinkClass =
    'inline-flex h-11 items-center rounded-xl px-3 text-base font-f-normal text-[#1C1C1C] transition-colors hover:bg-first/10 hover:text-first focus-visible:ring-2 focus-visible:ring-first dark:text-text';

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setIsMobileCategoryOpen(false);
    setOpenMobileCategoryId(null);
  }, []);

  useEffect(() => {
    if (activeCategoryIndex >= categoryList.length) {
      setActiveCategoryIndex(0);
    }
  }, [activeCategoryIndex, categoryList.length]);

  useEffect(() => {
    setIsDesktopCategoryOpen(false);
    setIsProfileMenuOpen(false);
    closeDrawer();
  }, [closeDrawer, location.hash, location.key, location.pathname, location.search]);

  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch, basePath]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const focusTimer = window.setTimeout(() => drawerCloseButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isDesktopCategoryOpen &&
        desktopCategoryRef.current &&
        !desktopCategoryRef.current.contains(target)
      ) {
        setIsDesktopCategoryOpen(false);
      }

      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDesktopCategoryOpen, isProfileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (isDesktopCategoryOpen) desktopCategoryButtonRef.current?.focus();
      if (isDrawerOpen) menuButtonRef.current?.focus();
      setIsDesktopCategoryOpen(false);
      setIsProfileMenuOpen(false);
      closeDrawer();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeDrawer, isDesktopCategoryOpen, isDrawerOpen]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSearch = searchValue.trim() || undefined;
    setSearchValue(normalizedSearch ?? '');
    setSearchText(normalizedSearch);

    const params = new URLSearchParams(basePath === '/products' ? location.search : '');
    params.delete('search');
    params.delete('q');
    if (normalizedSearch) {
      params.set('search', normalizedSearch);
    }

    navigate(localizedPath(params.toString() ? `/products?${params.toString()}` : '/products'));
  };

  const handleClearSearch = (mobile: boolean) => {
    setSearchValue('');
    (mobile ? mobileSearchRef : desktopSearchRef).current?.focus();

    if (basePath !== '/products') return;

    setSearchText(undefined);
    if (!activeSearch) return;

    const params = new URLSearchParams(location.search);
    params.delete('search');
    params.delete('q');
    navigate({
      pathname: location.pathname,
      search: params.toString() ? `?${params.toString()}` : '',
      hash: location.hash,
    });
  };

  const categoryHref = (id: string | number) =>
    localizedPath(`/products?categoryIds=${String(id)}`);

  const handleCategoryClick = (id: string | number) => {
    setCategoryIds([String(id)]);
    setIsDesktopCategoryOpen(false);
    closeDrawer();
  };

  const openDrawer = () => {
    setDrawerDirection(dir);
    setIsDrawerOpen(true);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    closeDrawer();
    logout();
    navigate(localizedPath('/'));
  };

  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const renderSearchForm = (id: string, mobile = false) => (
    <form
      className={cn(
        'flex h-14 w-full items-center overflow-hidden rounded-[24px] bg-white transition-shadow focus-within:ring-2 focus-within:ring-first',
        !mobile && 'max-w-[34rem]',
      )}
      role="search"
      aria-label={labels.search}
      onSubmit={handleSearchSubmit}
    >
      <label className="sr-only" htmlFor={id}>
        {labels.search}
      </label>
      <input
        id={id}
        ref={mobile ? mobileSearchRef : desktopSearchRef}
        dir={dir}
        type="search"
        value={searchValue}
        placeholder={labels.search}
        autoComplete="off"
        className="no-clear-button h-full min-w-0 flex-1 bg-white px-4 text-sm text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C] sm:px-6"
        onChange={(event) => handleSearchChange(event.target.value)}
      />
      {searchValue && (
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-[#656464] transition-colors hover:bg-first/10 hover:text-first focus-visible:ring-2 focus-visible:ring-first"
          aria-label={labels.clearSearch}
          title={labels.clearSearch}
          onClick={() => handleClearSearch(mobile)}
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        className="inline-flex h-full w-[54px] shrink-0 items-center justify-center px-4 text-[#1C1C1C] transition-colors hover:bg-first/10 hover:text-first"
        aria-label={t('nav.search')}
      >
        <Search className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </button>
    </form>
  );

  const renderCartLink = () => (
    <Link
      to={localizedPath('/cart')}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-first text-white transition-[background-color,box-shadow] hover:bg-first-600 hover:shadow-[-4px_4px_5px_0px_#BF000040] focus-visible:ring-2 focus-visible:ring-first focus-visible:ring-offset-2"
      aria-label={`${labels.cart}: ${cartCount}`}
    >
      <CartIcon />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -end-1.5 min-w-5 rounded-full bg-secound px-1 text-center text-[11px] font-f-sbold leading-5 text-white">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );

  const renderAccountControl = () => {
    if (!isAuthenticated) {
      return (
        <Link
          to={localizedPath('/auth')}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-2 text-sm font-f-sbold font-semibold text-[#1C1C1C] transition-colors hover:bg-first/10 focus-visible:ring-2 focus-visible:ring-first dark:text-text"
          aria-label={labels.login}
        >
          <User2
            className="h-5 w-5 shrink-0 transition-colors group-hover:text-first"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="transition-colors group-hover:text-first">{labels.loginShort}</span>
          <span
            className="h-3 w-px bg-[#D9D9D9] transition-colors group-hover:bg-first/40"
            aria-hidden="true"
          />
          <span className="transition-colors group-hover:text-first">{labels.register}</span>
        </Link>
      );
    }

    return (
      <div className="relative" ref={profileMenuRef}>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl px-2 text-sm text-[#1C1C1C] hover:text-first focus-visible:ring-2 focus-visible:ring-first dark:text-text"
          aria-label={labels.profile}
          aria-expanded={isProfileMenuOpen}
          aria-controls="desktop-profile-menu"
          onClick={() => setIsProfileMenuOpen((previous) => !previous)}
        >
          {userAvatar ? (
            <img src={userAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <User2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          )}
          <span className="max-w-28 truncate">{userName}</span>
        </button>

        <AnimatePresence>
          {isProfileMenuOpen && (
            <motion.div
              id="desktop-profile-menu"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'absolute top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-secound/20 bg-color-for-layer-on-body p-2 shadow-dark-sm',
                dir === 'rtl' ? 'left-0' : 'right-0',
              )}
            >
              <Link
                to={localizedPath('/profile')}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-secound/10"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secound text-white">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-f-sbold first-text-color">{userName}</p>
                  <p className="mt-0.5 text-xs text-secound">{labels.profile}</p>
                </div>
              </Link>
              <button
                type="button"
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm text-status-danger transition-colors hover:bg-status-danger"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {labels.logout}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderSupportContact = (mobile = false) => (
    <a
      href={storeContact.phoneHref}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-lg px-1.5 py-1 text-[#1C1C1C] transition-colors hover:text-first focus-visible:ring-2 focus-visible:ring-first dark:text-text',
        mobile && 'justify-center',
      )}
      aria-label={`${storeContact.phone} - ${labels.support}`}
      onClick={mobile ? closeDrawer : undefined}
    >
      <span className="flex min-w-0 flex-col leading-none">
        <span dir="ltr" className="text-sm font-f-sbold leading-4 tabular-nums">
          {storeContact.phone}
        </span>
        <span className="mt-0.5 text-[11px] leading-3 text-[#656464] dark:text-text-muted">
          {labels.support}
        </span>
      </span>
      <Phone className="h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
    </a>
  );

  return (
    <>
      <header
        dir={dir}
        data-navbar-root
        className="navbar-shell relative z-40 w-full bg-white px-3 pt-4 pb-4 dark:bg-background sm:px-6 sm:pt-5 sm:pb-5 lg:px-8 lg:pt-11 lg:pb-8"
      >
        <div className="mx-auto max-w-376 rounded-[32px] bg-surface p-4 shadow-sm sm:px-6 lg:flex lg:h-[212px] lg:flex-col lg:px-11 lg:py-8 lg:shadow-none">
          <div className="navbar-desktop-divider hidden min-h-0 flex-1 items-center justify-between gap-6 pb-6 lg:flex">
            <div className="flex min-w-0 flex-1 items-center gap-6 xl:gap-8">
              <Link
                to={localizedPath('/')}
                className="flex shrink-0 items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-first"
                aria-label={storeBrandName}
              >
                <img src={MainLogo} alt="" className="h-14 w-14 shrink-0 object-contain" />
                <span className="shop-brand-name text-lg font-black text-first dark:text-text sm:text-xl xl:text-2xl">
                  {storeBrandName}
                </span>
              </Link>

              <div className="min-w-0 flex-1">{renderSearchForm('desktop-navbar-search')}</div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {renderCartLink()}
              <ThemeToggleButton className="h-11 w-11 shrink-0 rounded-xl text-[#1C1C1C] hover:bg-first/10 dark:text-text" />
              <span className="h-6 w-px bg-[#D9D9D9]" aria-hidden="true" />
              <div dir={dir}>{renderAccountControl()}</div>
            </div>
          </div>

          <nav
            className="hidden h-[68px] items-end justify-between gap-5 pt-6 lg:flex"
            aria-label={labels.navigationLabel}
          >
            <ul className="flex min-w-0 items-center gap-3 xl:gap-5">
              <li
                className="relative"
                ref={desktopCategoryRef}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsDesktopCategoryOpen(false);
                  }
                }}
              >
                <button
                  ref={desktopCategoryButtonRef}
                  type="button"
                  className={cn(
                    navLinkClass,
                    'gap-2',
                    isCategoryRoute
                      ? 'bg-first/10 font-f-sbold text-first dark:text-first-300'
                      : '',
                  )}
                  aria-haspopup="true"
                  aria-expanded={isDesktopCategoryOpen}
                  aria-controls="desktop-category-menu"
                  onClick={() => setIsDesktopCategoryOpen((previous) => !previous)}
                >
                  <Grid2x2 className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                  <span>{labels.categories}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 mb-0.5 transition-transform',
                      isDesktopCategoryOpen && 'rotate-180',
                    )}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {isDesktopCategoryOpen && (
                    <motion.div
                      id="desktop-category-menu"
                      initial={{ opacity: 0, y: 10, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.99 }}
                      transition={{ duration: 0.16 }}
                      className={cn(
                        'absolute top-full z-50 mt-3 w-[min(60rem,calc(100vw-3rem))] overflow-hidden rounded-3xl border border-color-theme bg-color-for-layer-on-body shadow-dark-sm',
                        dir === 'rtl' ? 'right-0' : 'left-0',
                      )}
                    >
                      <div className="grid grid-cols-[20rem_minmax(0,1fr)]">
                        <div className="border-e border-color-theme bg-color-for-layer-sec p-4">
                          <ul className="navbar-category-scroll max-h-[min(24rem,calc(100dvh-10rem))] space-y-1.5 overflow-y-auto pe-1">
                            {categoryList.length > 0 ? (
                              categoryList.map((category, index) => (
                                <li key={category.id}>
                                  <button
                                    type="button"
                                    className={cn(
                                      'flex min-h-11 w-full items-center rounded-xl px-3 py-2 text-start text-sm transition-colors',
                                      activeCategoryIndex === index
                                        ? 'bg-secound/10 font-f-sbold text-secound'
                                        : 'bg-color-for-layer-on-body first-text-color-for-paragraph hover:bg-secound/10 hover:text-secound',
                                    )}
                                    aria-pressed={activeCategoryIndex === index}
                                    onClick={() => setActiveCategoryIndex(index)}
                                    onMouseEnter={() => setActiveCategoryIndex(index)}
                                    onFocus={() => setActiveCategoryIndex(index)}
                                  >
                                    <span className="line-clamp-2">{category.name}</span>
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li className="rounded-xl bg-color-for-layer-on-body px-3 py-4 text-sm first-text-color-for-paragraph">
                                {areCategoriesPending
                                  ? labels.categoriesLoading
                                  : areCategoriesUnavailable
                                    ? labels.categoriesUnavailable
                                    : labels.noCategories}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="min-h-72 p-5 xl:p-6">
                          <div className="mb-4 flex items-center justify-between gap-4 border-b border-color-theme pb-4">
                            <h2 className="text-lg font-f-sbold first-text-color">
                              {activeCategory?.name || labels.categories}
                            </h2>
                            {activeCategory && (
                              <Link
                                className="inline-flex h-10 shrink-0 items-center rounded-xl bg-secound px-4 text-sm font-f-sbold text-white transition-colors hover:bg-secound-600"
                                to={categoryHref(activeCategory.id)}
                                onClick={() => handleCategoryClick(activeCategory.id)}
                              >
                                {labels.all}
                              </Link>
                            )}
                          </div>

                          {activeCategory?.children?.length ? (
                            <ul className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                              {activeCategory.children.map((subCategory) => (
                                <li key={subCategory.id}>
                                  <Link
                                    className="flex min-h-11 items-center rounded-xl border border-transparent bg-color-for-layer-sec px-3 py-2 text-sm first-text-color-for-paragraph transition-colors hover:border-secound/30 hover:bg-secound/10 hover:text-secound"
                                    to={categoryHref(subCategory.id)}
                                    onClick={() => handleCategoryClick(subCategory.id)}
                                  >
                                    {subCategory.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-color-theme bg-color-for-layer-sec px-4 text-center text-sm first-text-color-for-paragraph">
                              {areCategoriesPending
                                ? labels.categoriesLoading
                                : areCategoriesUnavailable
                                  ? labels.categoriesUnavailable
                                  : labels.noCategories}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li className="h-6 w-px shrink-0 bg-[#D9D9D9]" aria-hidden="true" />

              {navLinks.map((link) => {
                const isActive = link.matches(basePath);
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={cn(
                        navLinkClass,
                        isActive ? 'bg-first/10 font-f-sbold text-first dark:text-first-300' : '',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            {renderSupportContact()}
          </nav>

          <div className="lg:hidden">
            <div className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2">
              <button
                ref={menuButtonRef}
                type="button"
                className={actionButtonClass}
                aria-label={labels.openMenu}
                aria-expanded={isDrawerOpen}
                aria-controls="mobile-navigation-drawer"
                onClick={openDrawer}
              >
                <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>

              <Link
                to={localizedPath('/')}
                className="flex min-w-0 items-center justify-center gap-2 rounded-xl focus-visible:ring-2 focus-visible:ring-first"
                aria-label={storeBrandName}
              >
                <img src={MainLogo} alt="" className="h-10 w-10 shrink-0 object-contain" />
                <span className="flex min-w-0 flex-col">
                  <span className="shop-brand-name truncate text-base font-black text-[#1C1C1C] dark:text-text sm:text-xl xl:text-2xl">
                    {storeBrandName}
                  </span>
                  <span className="truncate text-[11px] leading-4 text-text-muted">
                    {labels.mobileTagline}
                  </span>
                </span>
              </Link>

              <ThemeToggleButton className={actionButtonClass} />
            </div>

            <div className="mt-4">{renderSearchForm('mobile-navbar-search', true)}</div>
          </div>
        </div>
      </header>

      {isDrawerOpen && (
        <motion.div
          className="navbar-shell fixed inset-0 z-70 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 z-0 bg-color-for-overlay"
            aria-label={labels.closeMenu}
            onClick={closeDrawer}
          />

          <motion.aside
            ref={drawerRef}
            id="mobile-navigation-drawer"
            dir={drawerDirection}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            onKeyDown={handleDrawerKeyDown}
            className={cn(
              'absolute top-0 z-10 flex h-full w-[min(88vw,24rem)] flex-col bg-color-for-layer-on-body shadow-2xl',
              drawerDirection === 'rtl' ? 'right-0' : 'left-0',
            )}
            initial={{ x: drawerDirection === 'rtl' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'tween', duration: 0.24, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-color-theme p-4">
              <Link
                to={localizedPath('/')}
                className="flex min-w-0 items-center gap-2 rounded-xl"
                onClick={closeDrawer}
              >
                <img src={MainLogo} alt="" className="h-12 w-12 shrink-0 object-contain" />
                <span
                  id="mobile-navigation-title"
                  className="shop-brand-name truncate text-lg font-black text-secound sm:text-xl xl:text-2xl"
                >
                  {storeBrandName}
                </span>
              </Link>
              <button
                ref={drawerCloseButtonRef}
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secound text-white transition-colors hover:bg-secound-600"
                aria-label={labels.closeMenu}
                onClick={closeDrawer}
              >
                <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <section className="rounded-2xl border border-color-theme bg-color-for-layer-sec p-2">
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-start text-sm font-f-sbold first-text-color transition-colors hover:bg-color-for-layer-on-body"
                  aria-expanded={isMobileCategoryOpen}
                  aria-controls="mobile-category-list"
                  onClick={() => setIsMobileCategoryOpen((previous) => !previous)}
                >
                  <span>{labels.categories}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isMobileCategoryOpen && 'rotate-180',
                    )}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isMobileCategoryOpen && (
                    <motion.ul
                      id="mobile-category-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-1 overflow-hidden pt-1"
                    >
                      {categoryList.map((category) => {
                        const isOpen = openMobileCategoryId === category.id;
                        const hasChildren = Boolean(category.children?.length);

                        return (
                          <li key={category.id} className="rounded-xl bg-color-for-layer-on-body">
                            {hasChildren ? (
                              <>
                                <button
                                  type="button"
                                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-start text-sm first-text-color-for-paragraph"
                                  aria-expanded={isOpen}
                                  onClick={() =>
                                    setOpenMobileCategoryId((previous) =>
                                      previous === category.id ? null : category.id,
                                    )
                                  }
                                >
                                  <span>{category.name}</span>
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 shrink-0 transition-transform',
                                      isOpen && 'rotate-180',
                                    )}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                  />
                                </button>

                                <AnimatePresence initial={false}>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.18 }}
                                      className="overflow-hidden"
                                    >
                                      <ul className="space-y-1 border-t border-color-theme px-2 py-2">
                                        {category.children?.map((subCategory) => (
                                          <li key={subCategory.id}>
                                            <Link
                                              className="block rounded-lg px-3 py-2 text-sm first-text-color-for-paragraph transition-colors hover:bg-secound/10 hover:text-secound"
                                              to={categoryHref(subCategory.id)}
                                              onClick={() => handleCategoryClick(subCategory.id)}
                                            >
                                              {subCategory.name}
                                            </Link>
                                          </li>
                                        ))}
                                        <li>
                                          <Link
                                            className="mt-1 flex min-h-10 items-center justify-center rounded-lg bg-secound px-3 text-sm font-f-sbold text-white"
                                            to={categoryHref(category.id)}
                                            onClick={() => handleCategoryClick(category.id)}
                                          >
                                            {labels.all}
                                          </Link>
                                        </li>
                                      </ul>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            ) : (
                              <Link
                                className="flex min-h-11 items-center rounded-xl px-3 text-sm first-text-color-for-paragraph transition-colors hover:bg-secound/10 hover:text-secound"
                                to={categoryHref(category.id)}
                                onClick={() => handleCategoryClick(category.id)}
                              >
                                {category.name}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                      {categoryList.length === 0 && (
                        <li className="px-3 py-3 text-sm first-text-color-for-paragraph">
                          {areCategoriesPending
                            ? labels.categoriesLoading
                            : areCategoriesUnavailable
                              ? labels.categoriesUnavailable
                              : labels.noCategories}
                        </li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </section>

              <nav className="mt-4" aria-label={labels.menuTitle}>
                <ul className="space-y-1">
                  {drawerLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) =>
                            cn(
                              'flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm transition-colors',
                              isActive
                                ? 'bg-first/10 font-f-sbold text-first'
                                : 'first-text-color-for-paragraph hover:bg-secound/10 hover:text-secound',
                            )
                          }
                          onClick={closeDrawer}
                        >
                          <Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                          {link.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="border-t border-color-theme p-4">
              <div className="mb-3 flex justify-center">{renderSupportContact(true)}</div>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to={localizedPath('/profile')}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-secound/10"
                    onClick={closeDrawer}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secound text-white">
                      {userAvatar ? (
                        <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-f-sbold first-text-color">
                        {userName}
                      </span>
                      <span className="mt-0.5 block text-xs text-secound">{labels.profile}</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-status-danger px-3 text-sm text-status-danger transition-colors hover:bg-status-danger"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    {labels.logout}
                  </button>
                </div>
              ) : (
                <Link
                  to={localizedPath('/auth')}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-first px-4 text-sm font-f-sbold text-white transition-colors hover:bg-first-600"
                  onClick={closeDrawer}
                >
                  <LogIn className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  {labels.login}
                </Link>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
}
