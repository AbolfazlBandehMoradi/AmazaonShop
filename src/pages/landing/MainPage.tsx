import useIndex from '@/hooks/useIndex';
import useShowcases from '@/hooks/useShowcases';
import IndexLoading from '@/components/ui/IndexLoading';
import ApiError from '@/pages/error/ApiError';
import ProductSliderWithTab from './sections/ProductSliderWithTab';
import './MainPage.css';
import DiscountedProducts from './sections/DiscountedProducts';
import Hero from './sections/Hero';
import AboutBeris from './sections/AboutBeris';
import BlogsSlider from './sections/BlogsSlider';
import LandingCategories from './sections/LandingCategories';
import PromoBanners from './sections/PromoBanners';
import TestimonialsSlider from './sections/TestimonialsSlider';

const MainPage = () => {
  const { data: index, isLoading, isError, refetch } = useIndex();
  const { data: showcases } = useShowcases();

  if (isLoading && !index) {
    return <IndexLoading />;
  }

  if (isError) {
    return <ApiError onRetry={refetch} />;
  }

  return (
    <main >
      <Hero />
      <LandingCategories categories={index?.categories ?? []} />
      <ProductSliderWithTab showcases={showcases ?? []} />
      <AboutBeris />
      <DiscountedProducts discountedProduct={index?.discountProducts ?? []} />
      <PromoBanners />
      <BlogsSlider blogs={index?.blogs ?? []} />
      <TestimonialsSlider testimonials={index?.testimonials ?? []} />
    </main>
  );
};

export default MainPage;
