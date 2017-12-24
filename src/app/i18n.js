/**
 * i18n
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { sync as glob } from 'glob';
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-sync-fs-backend';
import i18nextLanguageDetector from 'i18next-electron-language-detector';

/* Files */
import i18nLogger from './i18nLogger';

export default (logger) => {
  const rootPath = path.join(__dirname, '..', 'locales');

  /* Treat the en directory as "master" */
  const ns = glob(`${rootPath}/en/*.json`)
    .map(filepath => filepath
      .replace(`${rootPath}/en/`, '')
      .replace(/\.json$/, ''));

  i18next
    .use(i18nLogger(logger.bunyan))
    .use(i18nextLanguageDetector)
    .use(i18nextFsBackend)
    .init({
      backend: {
        loadPath: path.join(rootPath, '{{lng}}', '{{ns}}.json'),
        addPath: path.join(rootPath, '{{lng}}', '{{ns}}.missing.json'),
      },
      debug: true,
      defaultNS: 'common',
      fallbackLng: 'en',
      initImmediate: false,
      ns,
    });

  return i18next;
};
