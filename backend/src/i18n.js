/**
 * Backend i18n module for RedstoneMind.
 * Uses i18next to support multiple languages.
 * Language follows the panel language setting.
 */
const i18next = require('i18next');
const path = require('path');
const fs = require('fs');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const SUPPORTED_LANGS = ['ru', 'en', 'pt-BR'];
const DEFAULT_LANG = 'ru';

// Load all locale files synchronously at startup
function loadResources() {
    const resources = {};

    for (const lang of SUPPORTED_LANGS) {
        resources[lang] = {};
        const langDir = path.join(LOCALES_DIR, lang);

        if (!fs.existsSync(langDir)) continue;

        const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const ns = file.replace('.json', '');
            try {
                const content = fs.readFileSync(path.join(langDir, file), 'utf-8');
                resources[lang][ns] = JSON.parse(content);
            } catch (err) {
                console.error(`[i18n] Failed to load ${lang}/${file}:`, err.message);
            }
        }
    }

    return resources;
}

const resources = loadResources();

// Get all namespace names
const namespaces = [...new Set(
    Object.values(resources).flatMap(langRes => Object.keys(langRes))
)];

i18next.init({
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    resources,
    ns: namespaces,
    defaultNS: 'core',
    interpolation: {
        escapeValue: false,
    },
    returnEmptyString: false,
});

/**
 * Translate a key.
 * @param {string} key - Translation key (e.g., 'namespace:key.path')
 * @param {object} [options] - Interpolation options
 * @returns {string} Translated string
 */
function t(key, options) {
    return i18next.t(key, options);
}

/**
 * Change the current language.
 * @param {string} lang - Language code ('ru', 'en', 'pt-BR')
 */
function setLanguage(lang) {
    if (SUPPORTED_LANGS.includes(lang)) {
        i18next.changeLanguage(lang);
    }
}

/**
 * Get the current language.
 * @returns {string}
 */
function getLanguage() {
    return i18next.language;
}

module.exports = { t, setLanguage, getLanguage, i18next, SUPPORTED_LANGS };
