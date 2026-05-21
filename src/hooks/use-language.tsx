"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.community': 'Community',
    'nav.about': 'About',
    'nav.login': 'Student Login',
    'nav.logout': 'Log out',
    'home.hero.title': 'Where Campus Connects',
    'home.hero.subtitle': 'Join the official digital square for verified students. Share ideas, get campus news, and build lasting friendships.',
    'home.hero.cta': 'Join the Community',
    'home.hero.browse': 'Browse Feed',
    'home.badge': 'Exclusively for Daegu University Students',
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': "Here's what's happening at Daegu University today.",
    'community.title': 'Student Square',
    'community.subtitle': 'Join the conversation with fellow Daegu students.',
    'community.search': 'Search campus discussions...',
    'lang.en': 'English',
    'lang.ko': '한국어'
  },
  ko: {
    'nav.dashboard': '대시보드',
    'nav.community': '커뮤니티',
    'nav.about': '정보',
    'nav.login': '학생 로그인',
    'nav.logout': '로그아웃',
    'home.hero.title': '캠퍼스가 연결되는 곳',
    'home.hero.subtitle': '인증된 학생들을 위한 공식 디지털 광장에 참여하세요. 아이디어를 공유하고, 캠퍼스 소식을 듣고, 지속적인 우정을 쌓으세요.',
    'home.hero.cta': '커뮤니티 가입하기',
    'home.hero.browse': '피드 둘러보기',
    'home.badge': '대구대학교 학생 전용',
    'dashboard.welcome': '환영합니다',
    'dashboard.subtitle': '오늘의 대구대학교 소식입니다.',
    'community.title': '학생 광장',
    'community.subtitle': '동료 대구대 학생들과 대화에 참여하세요.',
    'community.search': '캠퍼스 토론 검색...',
    'lang.en': 'English',
    'lang.ko': '한국어'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Language;
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
