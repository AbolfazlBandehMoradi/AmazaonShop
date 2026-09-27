import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/context/ToastContext';
import { copyToClipboard, getCleanUrl } from '@/utils/url';

interface Props {
  url?: string;
}

export function CopyLinkButton({ url }: Props) {
  const { success, error } = useToast();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    try {
      setLoading(true);
      const cleanUrl = getCleanUrl(url || window.location.href);
      const ok = await copyToClipboard(cleanUrl);
      if (!ok) {
        error(t('share.toast.copyError'));
        return;
      }
      success(t('share.toast.copySuccess'));
      setCopied(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
      error(t('share.toast.copyError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      disabled={loading}
      whileTap={{ scale: 0.95 }}
      aria-label={t('share.copy')}
      className={`relative flex h-10 w-full items-center justify-center overflow-hidden rounded-sm text-sm transition-all duration-200 ${
        copied ? 'bg-first text-white' : 'bg-first/5 text-first hover:bg-first/10'
      } ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <motion.div animate={pulse ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </motion.div>
      {loading && <span className="absolute text-xs opacity-60">{t('common.loading')}</span>}
    </motion.button>
  );
}
