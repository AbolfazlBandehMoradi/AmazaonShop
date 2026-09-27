import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type GoftinoWidgetOptions = {
  hasIcon?: boolean;
  marginBottom?: number;
  marginRight?: number;
};

type GoftinoApi = {
  close?: () => void;
  setWidget: (options: GoftinoWidgetOptions) => void;
};

declare global {
  interface Window {
    Goftino?: GoftinoApi;
  }
}

interface GoftinoWidgetProps {
  isHidden?: boolean;
}

const WIDGET_ID = 'ueMhpa';
const WIDGET_SCRIPT_ID = 'goftino-widget';
const DESKTOP_MARGIN = 20;
const MOBILE_BREAKPOINT = 1024;
const STICKY_GAP = 12;

function getWidgetMarginBottom() {
  if (window.innerWidth >= MOBILE_BREAKPOINT) return DESKTOP_MARGIN;

  const stickyAnchor = document.querySelector<HTMLElement>('[data-goftino-offset-anchor]');
  if (!stickyAnchor) return DESKTOP_MARGIN;

  const stickyHeight = stickyAnchor.offsetHeight;
  if (stickyHeight === 0) return DESKTOP_MARGIN;

  const computedBottom = Number.parseFloat(window.getComputedStyle(stickyAnchor).bottom);
  const bottomOffset = Number.isFinite(computedBottom) ? Math.max(0, computedBottom) : 0;

  return Math.max(DESKTOP_MARGIN, Math.ceil(stickyHeight + bottomOffset + STICKY_GAP));
}

const GoftinoWidget = ({ isHidden = false }: GoftinoWidgetProps) => {
  const location = useLocation();

  useEffect(() => {
    let animationFrame = 0;
    let observedAnchor: HTMLElement | null = null;

    const applyWidgetState = () => {
      if (!window.Goftino) return;

      if (isHidden) {
        window.Goftino.close?.();
        window.Goftino.setWidget({ hasIcon: false });
        return;
      }

      window.Goftino.setWidget({
        hasIcon: true,
        marginRight: DESKTOP_MARGIN,
        marginBottom: getWidgetMarginBottom(),
      });
    };

    const scheduleWidgetUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(applyWidgetState);
    };

    const resizeObserver = new ResizeObserver(scheduleWidgetUpdate);

    const observeStickyAnchor = () => {
      const nextAnchor = isHidden
        ? null
        : document.querySelector<HTMLElement>('[data-goftino-offset-anchor]');

      if (nextAnchor === observedAnchor) return;

      resizeObserver.disconnect();
      observedAnchor = nextAnchor;
      if (observedAnchor) {
        resizeObserver.observe(observedAnchor);
        mutationObserver.disconnect();
      }
      scheduleWidgetUpdate();
    };

    const mutationObserver = new MutationObserver(observeStickyAnchor);
    if (!isHidden) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      observeStickyAnchor();
    }

    window.addEventListener('goftino_ready', applyWidgetState);
    window.addEventListener('resize', scheduleWidgetUpdate);

    if (window.Goftino) applyWidgetState();

    const loadWidget = () => {
      if (isHidden || document.getElementById(WIDGET_SCRIPT_ID)) return;

      const script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.type = 'text/javascript';
      script.async = true;

      const local = localStorage.getItem(`goftino_${WIDGET_ID}`);
      script.src = local
        ? `https://www.goftino.com/widget/${WIDGET_ID}?o=${local}`
        : `https://www.goftino.com/widget/${WIDGET_ID}`;

      document.head.appendChild(script);
    };

    if (document.readyState === 'complete') {
      loadWidget();
    } else {
      window.addEventListener('load', loadWidget);
    }

    return () => {
      window.removeEventListener('load', loadWidget);
      window.removeEventListener('goftino_ready', applyWidgetState);
      window.removeEventListener('resize', scheduleWidgetUpdate);
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isHidden, location.pathname]);

  return null;
};

export default GoftinoWidget;
