import * as React from 'react';
import { DESKTOP_BREAKPOINT, MOBILE_MAX_QUERY } from '@/lib/config';

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(MOBILE_MAX_QUERY);
    const onChange = () => {
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
