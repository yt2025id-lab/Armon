import { useState, useCallback } from 'react'
import { Language } from '@/lib/i18n'

const LANGUAGE_KEY = 'armon_language'

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (stored === 'id' || stored === 'en') return stored
    return 'id'
  })

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem(LANGUAGE_KEY, newLang)
  }, [])

  return { lang, setLang }
}