export type BrandConfig = {
  brandName: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export const brandRegistry: Record<string, BrandConfig> = {
  ecg: {
    brandName: 'ECG',
    colorPalette: {
      primary: '#012b52',
      secondary: '#0f4c81',
      accent: '#f8fafc',
    },
  },
};

export function resolveBrand(brandId?: string): BrandConfig {
  if (!brandId) {
    return brandRegistry.ecg;
  }

  try {
    return brandRegistry[brandId] ?? brandRegistry.ecg;
  } catch {
    return brandRegistry.ecg;
  }
}

export const brandConfig = resolveBrand('ecg');
