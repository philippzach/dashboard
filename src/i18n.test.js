/* eslint-disable */
import en from './locales/en.json';
import de from './locales/de.json';


import { exec } from 'child_process';

describe('i18n', () => {
  test('Translations keys are the same for every language', () => {
    const translationKeysEn = iterate(en, '', []);
    const translationKeysDe = iterate(de, '', []);

    expect(translationKeysDe).toEqual(translationKeysEn);
  });
});

function iterate(obj, stack, array) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        iterate(obj[property], `${stack}.${property}`, array);
      } else {
        array.push(`${stack.slice(1)}.${property}`);
      }
    }
  }

  return array;
}