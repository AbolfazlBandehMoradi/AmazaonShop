import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  altText: string;
  displayOrder: number;
  category: GalleryCategory;
  image: string;
}

export interface GalleriesResponse {
  items: GalleryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface GalleriesByCategoryResponse {
  category: GalleryCategory & { description: string };
  count: number;
  items: Omit<GalleryItem, 'category'>[];
}

const useGalleries = () => {
  return useQuery<GalleriesResponse>({
    queryKey: ['galleries'],
    queryFn: () => {
      return apiClient.get('/ui/general/galleries').then((res) => res.data);
    },
    staleTime: 60 * 60 * 1000,
  });
};

export default useGalleries;

export const useGalleriesByCategory = (slug: string) => {
  return useQuery<GalleriesByCategoryResponse>({
    queryKey: ['galleries', 'by-category', slug],
    queryFn: () =>
      apiClient
        .get(`/ui/general/galleries/by-category/${encodeURIComponent(slug)}`, {
          params: {
            langCode: 'fa'
          }
        })
        .then((res) => res.data),
    staleTime: 60 * 60 * 1000,
  });
};
