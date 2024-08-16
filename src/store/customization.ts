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
}

const useCustomizationStore = create<CustomizationState>()((set, get) => ({
  countryCode: 'sv-SE',
  setCountry: (countryCode) => set({ countryCode }),
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
