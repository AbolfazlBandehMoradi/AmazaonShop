import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export function useSlideEdgeFade() {
  const [fadeWidth, setFadeWidth] = useState(0);

  const updateFade = (swiper: SwiperType) => {
    const slidesPerView = swiper.params.slidesPerView;

    if (swiper.isEnd) {
      setFadeWidth(0);
      return;
    }

    if (slidesPerView === 'auto') {
      const bounds = swiper.el.getBoundingClientRect();
      const edge = swiper.rtlTranslate ? bounds.left : bounds.right;
      const partialSlide = swiper.slides.find((slide) => {
        const rect = slide.getBoundingClientRect();
        return rect.left < edge && rect.right > edge;
      });

      if (!partialSlide) {
        setFadeWidth(0);
        return;
      }

      const rect = partialSlide.getBoundingClientRect();
      const visibleWidth = swiper.rtlTranslate ? rect.right - edge : edge - rect.left;
      const spaceBetween = Number(swiper.params.spaceBetween) || 0;
      // Fade across the partial card's border and its adjacent gap.
      setFadeWidth(Math.ceil(visibleWidth + spaceBetween * 2 + 2));
      return;
    }

    if (typeof slidesPerView !== 'number') {
      setFadeWidth(0);
      return;
    }

    const partialSlide = slidesPerView % 1;
    const spaceBetween = Number(swiper.params.spaceBetween) || 0;
    setFadeWidth(
      partialSlide ? Math.ceil(((swiper.width + spaceBetween) / slidesPerView) * partialSlide) : 0,
    );
  };

  return { fadeWidth, updateFade };
}
