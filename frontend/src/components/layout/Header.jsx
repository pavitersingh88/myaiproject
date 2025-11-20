import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-navy text-garrison-white px-4 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-h3 text-garrison-white">{t('app.name')}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-4 py-2 rounded-button hover:bg-opacity-80 transition-colors"
            aria-label={`Switch to ${i18n.language === 'en' ? 'French' : 'English'}`}
          >
            <Globe size={20} />
            <span className="text-sm font-semibold">{i18n.language.toUpperCase()}</span>
          </button>

          {profile && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-button hover:bg-opacity-80 transition-colors"
                aria-label="User menu"
                aria-expanded={showMenu}
              >
                <Menu size={20} />
                <span className="hidden md:inline text-sm">{profile.full_name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-garrison-white rounded-card shadow-lg py-2 text-navy">
                  <div className="px-4 py-2 border-b border-warm-gray">
                    <p className="text-sm font-semibold">{profile.full_name}</p>
                    <p className="text-xs text-warm-gray">{profile.email}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 hover:bg-beige transition-colors text-sm"
                  >
                    {t('auth.signOut')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
