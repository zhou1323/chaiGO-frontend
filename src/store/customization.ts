import { create } from 'zustand';

const countryCurrencyConfig = {
  'sv-SE': {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  },
  'en-US': {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  },
};

interface CustomizationState {
  countryCode: keyof typeof countryCurrencyConfig;
  setCountry: (countryCode: keyof typeof countryCurrencyConfig) => void;
  getCurrencyString: (value: number) => string;
  colorMode: 'light' | 'dark';
  setColorMode: (colorMode: 'light' | 'dark') => void;
}

const useCustomizationStore = create<CustomizationState>()((set, get) => ({
  countryCode: 'sv-SE',
  colorMode:
    typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
      : 'light',
  setCountry: (countryCode) => set({ countryCode }),
  setColorMode: (colorMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', colorMode);
    }
    set({ colorMode });
  },
  getCurrencyString: (value) => {
    const code = get().countryCode;
    const config = countryCurrencyConfig[code];

    if (!config) {
      return '';
    }

    return value.toLocaleString(code, config as Intl.NumberFormatOptions);
  },
}));

export default useCustomizationStore;
