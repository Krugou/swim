import en from '@/messages/en.json';
import fi from '@/messages/fi.json';
import sv from '@/messages/sv.json';
import { describe, expect, it } from 'vitest';

const getMessageKeys = (messages: unknown, prefix = ''): string[] => {
  if (typeof messages !== 'object' || messages === null || Array.isArray(messages)) {
    return [prefix];
  }

  return Object.entries(messages)
    .flatMap(([key, value]) => getMessageKeys(value, prefix ? `${prefix}.${key}` : key))
    .sort();
};

describe('translation files', () => {
  it('keep the same message keys in every supported locale', () => {
    const englishKeys = getMessageKeys(en);

    expect(getMessageKeys(fi)).toEqual(englishKeys);
    expect(getMessageKeys(sv)).toEqual(englishKeys);
  });
});
