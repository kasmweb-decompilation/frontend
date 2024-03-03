import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import common_en from "../public/locales/en/common.json";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: __KASM_BUILD_ID__ === '0.0.0.dev' ? true : false,
    fallbackLng: 'en',
    // lng: localStorage.getItem('i18nextLng') || 'en',
    supportedLngs: [
      'am', 'az', 'be', 'bg', 'bn', 'bs', 'cy', 'et', 'eu', 'fa', 'fy', 'ga', 'gd', 'gl', 'gu', 'ha', 'hr', 'ht', 'hy', 'id', 'ig', 'is', 'ka', 'kk', 'km', 'kn', 'ku', 'ky', 'lb', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'pa', 'ps', 'sd', 'si', 'sk', 'sl', 'so', 'sq', 'st', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tt', 'ur', 'uz', 'xh', 'yi', 'yo', 'zu',
      'en', 'af', 'ar', 'ca', 'zh-CN', 'zh-TW', 'cs', 'da', 'nl', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 'it', 'ja', 'ko', 'no', 'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sr', 'es', 'sv', 'tr', 'uk', 'vi'
    ],
    returnEmptyString: false,
    partialBundledLanguages: true,
    resources: {
      en: {
        common: common_en               // 'common' is our custom namespace
      },
    },
    backend: {
      loadPath: '/locales/{{lng}}/common.json',
    }
  });
export default i18n;