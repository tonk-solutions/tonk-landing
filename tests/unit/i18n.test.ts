import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import es from '../../messages/es.json';

const BANNED_TU_FORMS = [
  'Síguenos',
  'Hablas',
  'Cuéntanos',
  'Necesitas',
  'Encuentras',
  'Tienes',
  'Puedes',
  'Quieres',
  'Escríbenos',
  'Contáctanos',
];

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
};

const flattenKeys = (value: unknown, prefix = ''): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenKeys(item, `${prefix}[${index}]`));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, child]) =>
      flattenKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
};

describe('Spanish messages', () => {
  it('uses voseo instead of tú forms in every string value', () => {
    const violations = collectStrings(es).flatMap((text) =>
      BANNED_TU_FORMS.filter((word) => new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, 'iu').test(text)).map(
        (word) => `"${word}" in: ${text}`,
      ),
    );

    expect(violations).toEqual([]);
  });
});

describe('Message catalogs', () => {
  it('have exactly the same flattened key set', () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(es).sort());
  });

  it('do not leak the Spanish panel title into English', () => {
    expect(JSON.stringify(en)).not.toContain('Nuestros Servicios');
  });
});
