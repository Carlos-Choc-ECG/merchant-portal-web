// This is the temporary solution for the MVP.
// The future approach would be to use next-i18next and integrate with tools like Locize
// This way users can easily manage translations outside of the codebase and we can support multiple languages more easily.
import enUs from './en-US.json';

export type LocaleKey = 'en-US';

export type LocaleMessages = typeof enUs;

export const localeRegistry = {
  'en-US': enUs,
} as const satisfies Record<LocaleKey, LocaleMessages>;

export function resolveLocale(locale?: string): LocaleMessages {
  if (!locale) {
    return localeRegistry['en-US'];
  }

  try {
    const localeKey = locale as LocaleKey;
    return localeRegistry[localeKey] ?? localeRegistry['en-US'];
  } catch {
    return localeRegistry['en-US'];
  }
}
