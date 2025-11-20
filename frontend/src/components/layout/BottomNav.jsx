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

export default function BottomNav() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  if (!profile) return null;

  const navItems = ROLE_NAVIGATION[profile.role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-garrison-white border-t-2 border-warm-gray md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = iconMap[item];
          return (
            <NavLink
              key={item}
              to={item === 'home' ? '/' : `/${item}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
              }
              aria-label={t(`nav.${item}`)}
            >
              {Icon && <Icon size={24} />}
              <span className="text-xs mt-1">{t(`nav.${item}`)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
