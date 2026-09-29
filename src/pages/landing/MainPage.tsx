import useIndex from '@/hooks/useIndex';
import useShowcases from '@/hooks/useShowcases';
import IndexLoading from '@/components/ui/IndexLoading';
import ApiError from '@/pages/error/ApiError';
import './MainPage.css';
import DiscountedProducts from './sections/DiscountedProducts';
import Hero from './sections/Hero';
import BlogsSlider from './sections/BlogsSlider';
import TestimonialsSlider from './sections/TestimonialsSlider';
import MostViewedProducts from './sections/MostViewedProducts';
import LatestGallery from './sections/LatestGallery';

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
    <main>
      <Hero categories={index?.categories ?? []} />
      <MostViewedProducts showcase={showcases?.[0]} />
      <LatestGallery />
      <DiscountedProducts discountedProduct={index?.discountProducts ?? []} />
      <BlogsSlider blogs={index?.blogs ?? []} />
      <TestimonialsSlider testimonials={index?.testimonials ?? []} />
    </main>
  );
};

export default MainPage;
