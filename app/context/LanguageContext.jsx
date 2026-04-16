'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '../lib/i18n'

const LanguageContext = createContext({
  lang:       'en',
  toggleLang: () => {},
  t:          (key) => key,
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('howmany_lang')
      if (saved === 'es') setLang('es')
    } catch (_) {}
  }, [])

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'es' : 'en'
      try { localStorage.setItem('howmany_lang', next) } catch (_) {}
      return next
    })
  }, [])

  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
