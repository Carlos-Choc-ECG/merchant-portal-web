'use client';

import { useEffect } from 'react';
import type { BrandConfig } from '@/branding/brand';

export default function BrandProvider({ brand }: { brand: BrandConfig }) {
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--brand-primary', brand.colorPalette.primary);
    root.style.setProperty('--brand-secondary', brand.colorPalette.secondary);
    root.style.setProperty('--brand-accent', brand.colorPalette.accent);
    root.style.setProperty('--brand-name', brand.brandName);
  }, [brand]);

  return null;
}
