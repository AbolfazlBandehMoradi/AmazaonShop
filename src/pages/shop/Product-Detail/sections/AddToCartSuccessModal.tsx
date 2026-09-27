import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/Button';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

interface AddToCartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCart: () => void;
}

export function AddToCartSuccessModal({ isOpen, onClose, onViewCart }: AddToCartSuccessModalProps) {
  const { t } = useTranslation();

  usePageScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-color-for-overlay backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-4 w-full max-w-sm rounded-2xl border border-color-theme bg-color-for-layer-on-body p-8 text-center shadow-2xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-success">
                <CheckCircle2 className="h-12 w-12 text-status-success" />
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-bold first-text-color">
              {t('cart.addedToCart') || 'Added to Cart!'}
            </h3>
            <p className="mb-6 first-text-color-for-paragraph-low">
              {t('cart.itemAddedSuccessfully') || 'Item has been added to your cart successfully.'}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 first-text-color-for-paragraph"
              >
                {t('common.continueShopping') || 'Continue Shopping'}
              </Button>
              <Button
                onClick={onViewCart}
                className="flex-1 w-full text-white font-s-bold text-lg gap-2 bg-secound"
              >
                {t('cart.viewCart') || 'View Cart'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
