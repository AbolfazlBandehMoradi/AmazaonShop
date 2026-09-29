import { ImageOff, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';

interface Props {
  product: Product;
}


const HorizontalProductCard = ({
  product,
}: Props) => {

  const localizedPath = useLocalizedPath();

  const lang = useLangStore(
    state => state.lang
  );

  const [imageFailed,setImageFailed] =
    useState(false);


  return (

    <article
      className="
        h-full
        overflow-hidden
        rounded-2xl
        bg-color-for-layer-on-body
        transition-all
        duration-300
        min-h-[144px]

        hover:-translate-y-1
      "
    >

      <Link

        to={
          localizedPath(
            `/products/${product.slug}`
          )
        }

        className="
          flex
          h-full
          items-center
          gap-4
          p-3
        "
      >


        {/* Image */}

        <div
          className="
            relative
            flex
            size-24
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-color-for-layer-three
            sm:size-28
          "
        >

          {
            product.image &&
            !imageFailed ?

            <img

              src={product.image}

              alt={product.name}

              loading="lazy"

              decoding="async"

              onError={() =>
                setImageFailed(true)
              }

              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />

            :

            <ImageOff
              className="
                size-8
                opacity-40
              "
            />

          }

        </div>



        {/* Content */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            justify-between
            gap-3
          "
        >


          <div>

            <h3
              className="
                line-clamp-2
                text-sm
                font-f-bold
                first-text-color
                sm:text-base
              "
            >
              {product.name}
            </h3>



            <div
              className="
                mt-2
                flex
                items-center
                gap-1
                text-xs
              "
            >

              <Star
                className="
                  size-3.5
                  fill-current
                  text-yellow-500
                "
              />

              <span>
                {
                  product.rating ??
                  5
                }
              </span>

            </div>

          </div>



          <div
            dir="ltr"
            className="
              flex
              items-center
              justify-between
            "
          >

            <PriceDisplay

              amount={
                product.price
              }

              currency="IRT"

              languageCode={
                lang
              }

              className="
                text-sm
                font-f-bold
                first-text-color
              "
            />



            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-first/5
              "
            >

              <ShoppingCart
                className="
                  size-4
                "
              />

            </span>


          </div>


        </div>


      </Link>


    </article>

  );

};


export default HorizontalProductCard;
