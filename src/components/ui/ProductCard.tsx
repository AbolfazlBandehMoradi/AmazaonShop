import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onLinkHover: (isHovering: boolean | null, id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const [imageError, setImageError] = useState(false);
  const localizedPath = useLocalizedPath();
  const productUrl = localizedPath(`/products/${product.slug}`);

  // Fallback image logic using placehold.co
  const imageUrl = imageError
    ? `https://placehold.co/600x400/f1f5f9/475569?text=${encodeURIComponent(
        product.nameEn || "Product"
      )}`
    : product.image;

  const displayName = isRTL ? product.name : product.nameEn || product.name;
  const price = <PriceDisplay amount={product.price} languageCode={isRTL ? 'fa' : 'en'} />;

  return (
    <div className="h-95  p-4 rounded-2xl  bg-color-for-layer-sec relative flex flex-col justify-between">
      <Link
        to={product.inStock ? productUrl : "#"}
        className={`flex flex-col h-full ${
          !product.inStock ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {/* --- Image Section --- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-color-for-layer-three">
          <motion.img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-cover origin-center transition-transform duration-700 will-change-transform group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Dark Overlay gradient on hover */}
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--first-text-color)_0%,transparent)] transition-colors duration-300 group-hover:bg-[color-mix(in_srgb,var(--first-text-color)_10%,transparent)]" />

          {/* Badges (Top Left/Right) */}
          <div className="absolute top-4 start-4 flex flex-col gap-2 z-10">
            {product.discount && (
              <Badge
                variant="danger"
                className="shadow-sm backdrop-blur-md bg-red-500/90 text-white border-0 px-2.5 py-1"
              >
                {product.discount}% {isRTL ? "تخفیف" : "OFF"}
              </Badge>
            )}
            {!product.inStock && (
              <Badge
                variant="default"
                className="border-0 bg-color-for-tooltip text-color-for-tooltip shadow-sm backdrop-blur-md"
              >
                {t("products.outOfStock")}
              </Badge>
            )}
          </div>
          <div className="absolute top-4 end-4 flex flex-col gap-2 translate-x-12 rtl:-translate-x-12 group-hover:translate-x-0 rtl:group-hover:translate-x-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onQuickView?.(product);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_90%,transparent)] first-text-color-for-paragraph shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-first hover:text-white"
              title={t("products.quickView") || "Quick View"}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_90%,transparent)] first-text-color-for-paragraph shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-secound hover:text-white"
              title={t("products.wishlist") || "Add to Wishlist"}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 flex flex-col flex-grow relative">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium first-text-color-for-paragraph">
              {product.rating?.toFixed(1) || "4.5"}
            </span>
            <span className="text-xs first-text-color-for-paragraph-low">
              ({product.reviewsCount || 85})
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1 line-clamp-1 text-lg font-bold first-text-color transition-colors group-hover:text-first">
            {displayName}
          </h3>

          {/* Subtitle / Category */}
          <p className="mb-4 line-clamp-1 text-xs first-text-color-for-paragraph-low">
            {isRTL ? "محصولات دیجیتال" : "Digital Products"}
          </p>

          {/* Footer Area: Price <-> Add to Cart Swap */}
          <div className="mt-auto relative h-12 overflow-hidden">
            {/* 1. Price State (Visible by default, slides OUT UP on hover) */}
            <div className="absolute inset-0 flex items-center justify-between transition-transform duration-500 group-hover:-translate-y-[150%]">
              <div className="flex flex-col">
                <span className="text-lg font-bold first-text-color">
                  {price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs first-text-color-for-paragraph-low line-through decoration-current/50">
                    <PriceDisplay amount={product.originalPrice} languageCode={isRTL ? 'fa' : 'en'} />
                  </span>
                )}
              </div>
              {product.inStock && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-for-layer-on-body first-text-color-for-paragraph-low">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* 2. Button State (Hidden below, slides IN UP on hover) */}
            <div className="absolute inset-0 flex items-center transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
              <Button
                variant="primary"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-none first-style-button-bg text-white shadow-first-sm"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t("products.addToCart")}</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

