import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

export default function Tutorials() {
  const { t } = useTranslation();

  const tutorials = [
    { id: 1, title: 'Making Video Calls', difficulty: 'Beginner', status: 'completed' },
    { id: 2, title: 'Recognizing Scams', difficulty: 'Beginner', status: 'in-progress' },
    { id: 3, title: 'Online Banking Safety', difficulty: 'Intermediate', status: 'new' },
    { id: 4, title: 'Using Email Safely', difficulty: 'Beginner', status: 'new' },
    { id: 5, title: 'Social Media Basics', difficulty: 'Beginner', status: 'new' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-display mb-6">{t('tutorials.title')}</h1>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-warm-gray" size={20} />
            <input
              type="text"
              placeholder={t('tutorials.search')}
              className="input-field pl-12"
            />
          </div>
          <button className="btn-secondary flex items-center justify-center">
            <Filter size={20} className="mr-2" />
            {t('tutorials.filter')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-h2 mb-4">{t('tutorials.recommended')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tutorials.slice(0, 3).map((tutorial) => (
              <div key={tutorial.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-h3">{tutorial.title}</h3>
                  {tutorial.status === 'completed' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Completed
                    </span>
                  )}
                  {tutorial.status === 'in-progress' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-warm-gray mb-3">Difficulty: {tutorial.difficulty}</p>
                <button className="btn-primary w-full">
                  {tutorial.status === 'completed' ? 'Review' : 'Start Learning'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">All Tutorials</h2>
          <div className="space-y-3">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="card flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{tutorial.title}</h3>
                  <p className="text-sm text-warm-gray">Difficulty: {tutorial.difficulty}</p>
                </div>
                <button className="btn-secondary">View</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
