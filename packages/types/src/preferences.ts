export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface UserPreferences {
  theme: Theme;
  language: Language;
  updatedAt?: Date;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};
