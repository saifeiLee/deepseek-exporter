import i18next from 'i18next';
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

// Detect user's browser language
const detectUserLanguage = () => {
  const language = navigator.language || navigator.userLanguage;
  // Check if the language starts with 'zh'
  if (language.startsWith('zh')) {
    return 'zh';
  }
  // Default to English for all other languages
  return 'en';
};

// Initialize i18next
const i18n = i18next.createInstance();
i18n.init({
  lng: detectUserLanguage(),
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enTranslation
    },
    zh: {
      translation: zhTranslation
    }
  },
  interpolation: {
    escapeValue: false // React already escapes values
  }
});

export default i18n; 