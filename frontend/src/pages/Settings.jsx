import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Settings() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useAuth();
  const [fontSize, setFontSize] = useState(profile?.accessibility_settings?.fontSize || 'medium');
  const [contrast, setContrast] = useState(profile?.accessibility_settings?.contrast || 'normal');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        accessibility_settings: {
          fontSize,
          contrast
        }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-display mb-6">{t('settings.title')}</h1>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-h2 mb-4">{t('settings.accessibility')}</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="fontSize" className="block text-lg font-semibold mb-2">
                {t('settings.fontSize')}
              </label>
              <select
                id="fontSize"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="input-field"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div>
              <label htmlFor="contrast" className="block text-lg font-semibold mb-2">
                {t('settings.contrast')}
              </label>
              <select
                id="contrast"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                className="input-field"
              >
                <option value="normal">Normal</option>
                <option value="high">High Contrast</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full"
            >
              {saving ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-h2 mb-4">{t('settings.account')}</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <p className="text-lg">{profile?.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <p className="text-lg">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Role</label>
              <p className="text-lg capitalize">{profile?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-h2 mb-4">{t('settings.notifications')}</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-lg">Email Notifications</span>
              <input type="checkbox" className="w-6 h-6" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-lg">Reminder Alerts</span>
              <input type="checkbox" className="w-6 h-6" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-lg">Message Notifications</span>
              <input type="checkbox" className="w-6 h-6" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
