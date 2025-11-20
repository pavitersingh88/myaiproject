import { useTranslation } from 'react-i18next';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function Reminders() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const reminders = {
    upcoming: [
      { id: 1, title: 'Task A', time: '10:00 AM', date: 'Today' },
      { id: 2, title: 'Task B', time: '2:00 PM', date: 'Today' },
      { id: 3, title: 'Task C', time: '9:00 AM', date: 'Tomorrow' },
    ],
    missed: [
      { id: 4, title: 'Task D', time: '8:00 AM', date: 'Yesterday' },
    ],
    completed: [
      { id: 5, title: 'Task E', time: '7:00 AM', date: 'Today' },
      { id: 6, title: 'Task F', time: '6:00 PM', date: 'Yesterday' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display">{t('reminders.title')}</h1>
        <button className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          {t('reminders.create')}
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex space-x-2 border-b border-warm-gray">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-navy text-navy'
                : 'text-warm-gray'
            }`}
          >
            {t('reminders.upcoming')}
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'missed'
                ? 'border-b-2 border-navy text-navy'
                : 'text-warm-gray'
            }`}
          >
            {t('reminders.missed')}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'completed'
                ? 'border-b-2 border-navy text-navy'
                : 'text-warm-gray'
            }`}
          >
            {t('reminders.completed')}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {reminders[activeTab].map((reminder) => (
          <div key={reminder.id} className="card flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {activeTab === 'upcoming' && <Clock size={24} className="text-navy" />}
              {activeTab === 'missed' && <XCircle size={24} className="text-red-600" />}
              {activeTab === 'completed' && <CheckCircle size={24} className="text-green-600" />}
              <div>
                <h3 className="font-semibold text-lg">{reminder.title}</h3>
                <p className="text-sm text-warm-gray">
                  {reminder.date} at {reminder.time}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {activeTab === 'upcoming' && (
                <>
                  <button className="btn-primary">{t('reminders.complete')}</button>
                  <button className="btn-secondary">{t('reminders.snooze')}</button>
                </>
              )}
              {activeTab !== 'completed' && (
                <button className="text-warm-gray hover:text-navy">{t('common.edit')}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
