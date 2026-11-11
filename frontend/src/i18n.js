import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({

    fallbackLng: 'en',

    supportedLngs: ['en', 'ru', 'pt-BR'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'sidebar', 'bots', 'console', 'minecraft-viewer', 'plugins', 'websocket', 'management', 'event-graphs', 'visual-editor', 'nodes', 'login', 'admin', 'tasks', 'servers', 'proxies', 'graph-store', 'plugin-detail', 'configuration', 'api-keys', 'setup', 'permissions', 'dialogs', 'action'],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'redstonemind-language',
    },

    // debug: true,
  });

export default i18n;
