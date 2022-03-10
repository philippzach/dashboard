import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '../src/locales/en.json';
import translationDE from '../src/locales/de.json';
import { CURRENCY_CODE_HTML } from './config';

// the translations
const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    }
};
const detectionOptions = {
    order: [ 'cookie', 'navigator', 'localStorage', 'subdomain', 'queryString', 'htmlTag', 'path'],
    lookupFromPathIndex: 0

}
i18n
    .use(detector)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        fallbackLng: "en", // use en if detected lng is not available
        debug: false,
        detection: detectionOptions,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            defaultVariables: {
                CURRENCY_CODE_HTML: CURRENCY_CODE_HTML
            },
            escapeValue: false // react already safes from xss
        }
    }, (err, t) => {
        if (err)
            console.error(err)
    });
export default i18n;
