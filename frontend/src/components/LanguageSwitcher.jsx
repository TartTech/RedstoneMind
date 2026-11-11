import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const LANGUAGE_CHOSEN_KEY = 'redstonemind-language-chosen';

function RussianFlag({ className }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#fff" />
      <rect y="8" width="32" height="8" fill="#2563EB" />
      <rect y="16" width="32" height="8" fill="#DC2626" />
    </svg>
  );
}

function UsaFlag({ className }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#fff" />
      {Array.from({ length: 7 }).map((_, index) => (
        <rect
          key={`stripe-${index}`}
          y={index * 24 / 7}
          width="32"
          height={24 / 14}
          fill="#DC2626"
        />
      ))}
      <rect width="14" height="11" rx="2" fill="#1D4ED8" />
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: row % 2 === 0 ? 4 : 3 }).map((__, col) => (
          <circle
            key={`star-${row}-${col}`}
            cx={row % 2 === 0 ? 2.2 + col * 2.9 : 3.65 + col * 2.9}
            cy={1.6 + row * 1.05}
            r="0.33"
            fill="#fff"
          />
        ))
      )}
    </svg>
  );
}

function BrazilFlag({ className }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#009739" />
      <polygon points="16,2 30,12 16,22 2,12" fill="#FEDD00" />
      <circle cx="16" cy="12" r="5" fill="#012169" />
      <path d="M8.5,12 C8.5,12 12,15 16,15 C20,15 23.5,12 23.5,12" fill="none" stroke="#fff" strokeWidth="0.8" />
    </svg>
  );
}

function LanguageFlag({ code, className }) {
  if (code === 'en') {
    return <UsaFlag className={className} />;
  }
  if (code === 'pt-BR') {
    return <BrazilFlag className={className} />;
  }
  return <RussianFlag className={className} />;
}

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'pt-BR', name: 'Português (BR)' },
];

export default function LanguageSwitcher({ isCollapsed, compact = false }) {
  const { i18n } = useTranslation();

  const rawLang = i18n.resolvedLanguage || i18n.language || 'ru';
  const currentLang = languages.find((language) => language.code === rawLang)
    || languages.find((language) => language.code === rawLang.split('-')[0])
    || languages[0];
  const normalizedLanguage = currentLang.code;

  const handleChangeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem(LANGUAGE_CHOSEN_KEY, 'true');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed || compact ? (
          <Button
            variant="ghost"
            size="icon"
            title={currentLang.name}
            aria-label={currentLang.name}
            className={cn(
              "flex text-muted-foreground transition-[background-color,color] duration-300 ease-out hover:text-foreground hover:bg-muted/50",
              isCollapsed ? "mx-auto" : "h-8 w-8"
            )}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              <LanguageFlag
                code={currentLang.code}
                className="h-3.5 w-4 overflow-hidden rounded-sm shadow-sm"
              />
            </span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full rounded-md text-sm font-medium transition-[background-color,color,gap,padding] duration-300 ease-out h-9 justify-start px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              <LanguageFlag
                code={currentLang.code}
                className="h-3.5 w-4 overflow-hidden rounded-sm shadow-sm"
              />
            </span>
            <span
              className={cn(
                'truncate overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform,margin] duration-300 ease-out',
                'ml-2 max-w-[120px] opacity-100 translate-x-0'
              )}
            >
              {currentLang.name}
            </span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChangeLanguage(lang.code)}
            className={cn(
              'flex cursor-pointer items-center gap-3',
              normalizedLanguage === lang.code && 'bg-accent'
            )}
          >
            <LanguageFlag
              code={lang.code}
              className="h-5 w-7 overflow-hidden rounded-sm shadow-sm"
            />
            <span className="flex-1">{lang.name}</span>
            {normalizedLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
