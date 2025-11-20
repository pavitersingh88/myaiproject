import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Home, BookOpen, Bell, Users, Settings, MessageSquare, FileText } from 'lucide-react';
import { ROLE_NAVIGATION } from '../../config/roles';

const iconMap = {
  home: Home,
  tutorials: BookOpen,
  reminders: Bell,
  'care-team': Users,
  settings: Settings,
  messages: MessageSquare,
  resources: FileText,
  content: FileText
};

export default function Sidebar() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  if (!profile) return null;

  const navItems = ROLE_NAVIGATION[profile.role] || [];

  return (
    <aside className="hidden md:block w-64 bg-beige min-h-screen p-6 border-r-2 border-warm-gray">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = iconMap[item];
          return (
            <NavLink
              key={item}
              to={item === 'home' ? '/' : `/${item}`}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-button transition-colors ${
                  isActive
                    ? 'bg-navy text-garrison-white font-semibold'
                    : 'text-navy hover:bg-warm-gray'
                }`
              }
              aria-label={t(`nav.${item}`)}
            >
              {Icon && <Icon size={20} />}
              <span>{t(`nav.${item}`)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
