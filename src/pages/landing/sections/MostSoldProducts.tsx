import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import HorizontalProductCard from '@/components/reusable-components/ProductSection/HorizontalProductCard';
import type { Showcase } from '@/hooks/useShowcases';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';


interface Props {
  showcase?: Showcase;
}


const MostSoldProducts = ({
  showcase,
}: Props) => {

  const { t } = useTranslation();

  const { dir } = useLangStore();


  const isRtl = dir === 'rtl';


  const products = useMemo(
    () =>
      [...(showcase?.items ?? [])].sort(
        (a, b) =>
          a.sortOrder - b.sortOrder,
      ),
    [showcase?.items],
  );


  const productGroups = useMemo(
    () => {
      const groups = [];

      for (
        let i = 0;
        i < products.length;
        i += 2
      ) {
        groups.push(
          products.slice(
            i,
            i + 2,
          ),
        );
      }

      return groups;
    },
    [products],
  );


  const title =
    showcase?.translation?.title?.trim()
    ||
    [
      t(
        'mainpage.mostSoldProducts.titlePrefix',
      ),
      t(
        'mainpage.mostSoldProducts.titleAccent',
      ),
      t(
        'mainpage.mostSoldProducts.titleSuffix',
      ),
    ]
      .filter(Boolean)
      .join(' ');


  if (!products.length) {
    return null;
  }


  return (

    <section

      dir={dir}

      className="
        landing-section
        overflow-hidden
      "

      aria-labelledby="
        most-sold-products-title
      "

    >

      <div
        className="
          landing-container
        "
      >


        {/* Header */}

        <div
          className="
            flex
            items-center
            gap-2.5
            sm:gap-3
          "
        >

          <span

            aria-hidden="true"

            className="
              h-[18px]
              w-2.5
              shrink-0
              rounded-full
              bg-third
            "

          />


          <h2

            id="
              most-sold-products-title
            "

            className="
              shrink-0
              text-lg
              font-s-sbold
              first-text-color

              sm:text-xl
              lg:text-2xl
            "

          >

            {title}

          </h2>


          <span

            aria-hidden="true"

            className={cn(
              `
              h-0.5
              flex-1
              rounded-full
              mx-1.5
              `,
              isRtl
                ?
                `
                bg-gradient-to-l
                from-first/20
                via-first/10
                to-transparent
                `
                :
                `
                bg-gradient-to-r
                from-first/20
                via-first/10
                to-transparent
                `,
            )}

          />


        </div>



        {/* Slider */}

        <div
          className="
            mt-5
            sm:mt-6
          "
        >

          <Swiper

            dir={dir}

            modules={[
              A11y,
            ]}

            className="
              w-full

              [&_.swiper-wrapper]:
              items-stretch
            "

            slidesPerView={1.05}

            spaceBetween={14}

            grabCursor

            watchOverflow

            a11y={{
              enabled:true,
            }}


            breakpoints={{

              640:{
                slidesPerView:1.3,
                spaceBetween:16,
              },


              768:{
                slidesPerView:2,
                spaceBetween:18,
              },


              1280:{
                slidesPerView:3,
                spaceBetween:20,
              },


            }}

          >


            {
              productGroups.map(
                (
                  group,
                  index,
                ) => (

                <SwiperSlide

                  key={index}

                  className="
                    h-auto
                  "

                >

                  <div
                    className="
                      grid
                      gap-4
                    "
                  >

                    {
                      group.map(
                        item => (

                        <HorizontalProductCard

                          key={
                            item.id
                          }

                          product={
                            item.product
                          }

                        />

                      ))
                    }

                  </div>


                </SwiperSlide>


              ))
            }


          </Swiper>


        </div>


      </div>


    </section>

  );

};


export default MostSoldProducts;