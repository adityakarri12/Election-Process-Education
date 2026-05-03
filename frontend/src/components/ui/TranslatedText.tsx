"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TranslatedTextProps {
  children: string;
  className?: string;
}

export const TranslatedText = ({ children, className }: TranslatedTextProps) => {
  const { currentLanguage, translateText } = useLanguage();
  const [displayedText, setDisplayedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (currentLanguage.code === 'en') {
        setDisplayedText(children);
        return;
      }

      setIsTranslating(true);
      const translated = await translateText(children);
      setDisplayedText(translated);
      setIsTranslating(false);
    };

    performTranslation();
  }, [children, currentLanguage, translateText]);

  return (
    <span className={`${className} ${isTranslating ? 'animate-pulse opacity-70' : ''}`}>
      {displayedText}
    </span>
  );
};
