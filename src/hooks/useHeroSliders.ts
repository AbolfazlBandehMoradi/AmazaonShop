import { useQuery } from '@tanstack/react-query';

import apiClient from '@/services/apiClient';
import { useLangStore } from '@/stores/languageStore';

export interface HeroSlider {
  id: number | string;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  targetUrl?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  mediaUrl?: string | null;
  image?: string | null;
  previewUrl?: string | null;
  externalLink?: string | null;
  mediaFile?: { filePath?: string | null } | null;
  translation?: {
    title?: string | null;
    caption?: string | null;
    description?: string | null;
  } | null;
}

type HeroSlidersResponse = HeroSlider[] | { sliders: HeroSlider[] };

export default function useHeroSliders() {
  const lang = useLangStore((state) => state.lang);

  return useQuery({
    queryKey: ['hero-sliders', lang],
    queryFn: async (): Promise<HeroSlider[]> => {
      const { data } = await apiClient.get<HeroSlidersResponse>('/ui/general/sliders', {
        params: { langCode: lang, mediaType: 'Image' },
      });

      return Array.isArray(data) ? data : (data.sliders ?? []);
    },
    staleTime: 60_000,
  });
}
