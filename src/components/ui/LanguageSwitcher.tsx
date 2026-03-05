import { useT, type Lang } from '../../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useT();

  const toggle = () => setLang(lang === 'cs' ? 'en' : 'cs' as Lang);

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      title={lang === 'cs' ? 'Switch to English' : 'Přepnout do češtiny'}
    >
      <Globe size={14} />
      <span className="uppercase font-medium">{lang === 'cs' ? 'EN' : 'CZ'}</span>
    </button>
  );
}
