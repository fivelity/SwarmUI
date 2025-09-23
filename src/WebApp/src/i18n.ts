import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from '../../../languages/ar.json';
import de from '../../../languages/de.json';
import en from '../../../languages/en.json';
import es from '../../../languages/es.json';
import fr from '../../../languages/fr.json';
import hi from '../../../languages/hi.json';
import it from '../../../languages/it.json';
import ja from '../../../languages/ja.json';
import nl from '../../../languages/nl.json';
import pt from '../../../languages/pt.json';
import ru from '../../../languages/ru.json';
import sv from '../../../languages/sv.json';
import tr from '../../../languages/tr.json';
import vi from '../../../languages/vi.json';
import zh from '../../../languages/zh.json';

const resources = {
  ar: { translation: ar },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  it: { translation: it },
  ja: { translation: ja },
  nl: { translation: nl },
  pt: { translation: pt },
  ru: { translation: ru },
  sv: { translation: sv },
  tr: { translation: tr },
  vi: { translation: vi },
  zh: { translation: zh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
