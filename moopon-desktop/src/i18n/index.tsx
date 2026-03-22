import { createContext, useContext, useState, type ReactNode } from 'react';
import { en, type TranslationKeys } from './en';
import { tr } from './tr';

export type Language = 'en' | 'tr';

const translations: Record<Language, TranslationKeys> = { en, tr };

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'moopon_language';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return (stored === 'en' || stored === 'tr') ? stored : 'en';
    });

    const setLanguage = (lang: Language) => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        setLanguageState(lang);
    };

    const t = translations[language];

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

export function useLanguage() {
    const { language, setLanguage } = useI18n();
    return { language, setLanguage };
}

export function getStoredLanguage(): Language | null {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'tr') return stored;
    return null;
}

export function hasSelectedLanguage(): boolean {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) !== null;
}
