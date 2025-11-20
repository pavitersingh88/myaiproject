import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { MessageCircle, BookOpen, Bell, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROLES } from '../config/roles';

export default function Home() {
  const { profile } = useAuth();
  const { t } = useTranslation();

  if (!profile) return null;

  const renderOlderAdultDashboard = () => (
    <div className="space-y-6">
      <div className="card bg-beige">
        <h2 className="text-h2 mb-4">Ask SarAi</h2>
        <p className="mb-4">Get help with technology, safety tips, and more.</p>
        <button className="btn-primary">
          <MessageCircle className="inline mr-2" size={20} />
          {t('home.askQuestion')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/tutorials" className="card hover:shadow-lg transition-shadow">
          <BookOpen size={32} className="text-navy mb-3" />
          <h3 className="text-h3 mb-2">{t('home.startTutorial')}</h3>
          <p className="text-warm-gray">Learn at your own pace</p>
        </Link>

        <Link to="/reminders" className="card hover:shadow-lg transition-shadow">
          <Bell size={32} className="text-navy mb-3" />
          <h3 className="text-h3 mb-2">{t('home.addReminder')}</h3>
          <p className="text-warm-gray">Never miss important tasks</p>
        </Link>
      </div>

      <div className="card">
        <h3 className="text-h3 mb-4">Recommended for You</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-beige rounded-card">
              <h4 className="font-semibold mb-1">Tutorial {i}</h4>
              <p className="text-sm text-warm-gray">Learn something new today</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-navy text-garrison-white">
        <h3 className="text-h3 mb-2">{t('home.tipOfTheDay')}</h3>
        <p>Always verify the sender before clicking links in emails.</p>
      </div>
    </div>
  );

  const renderFamilyDashboard = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-h2 mb-4">How Things Are Going</h2>
        <p className="text-warm-gray mb-4">Stay connected with your loved one</p>
        <div className="flex space-x-3">
          <Link to="/messages" className="btn-primary">
            <MessageCircle className="inline mr-2" size={20} />
            Send Message
          </Link>
          <button className="btn-secondary">Share Resource</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-h3 mb-4">Resources & Articles</h3>
        <div className="space-y-3">
          <div className="p-4 bg-beige rounded-card">
            <h4 className="font-semibold mb-1">Scam Awareness</h4>
            <p className="text-sm text-warm-gray">Protect your loved ones from fraud</p>
          </div>
          <div className="p-4 bg-beige rounded-card">
            <h4 className="font-semibold mb-1">Technology Tips</h4>
            <p className="text-sm text-warm-gray">Help them stay connected</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPSWDashboard = () => (
    <div className="space-y-6">
      <div className="card bg-beige">
        <h2 className="text-h2 mb-4">Today's Tips</h2>
        <p className="mb-4">Quick reference for today's care activities</p>
        <button className="btn-primary">View Daily Tips</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/tutorials" className="card hover:shadow-lg transition-shadow">
          <BookOpen size={32} className="text-navy mb-3" />
          <h3 className="text-h3 mb-2">Client Training</h3>
          <p className="text-warm-gray">Access quick help guides</p>
        </Link>

        <Link to="/messages" className="card hover:shadow-lg transition-shadow">
          <MessageCircle size={32} className="text-navy mb-3" />
          <h3 className="text-h3 mb-2">Client Messages</h3>
          <p className="text-warm-gray">Communicate effectively</p>
        </Link>
      </div>

      <div className="card">
        <h3 className="text-h3 mb-4">Ask SarAi (Professional)</h3>
        <p className="mb-4">Get work-related Q&A and support</p>
        <button className="btn-secondary">
          <MessageCircle className="inline mr-2" size={20} />
          Ask a Question
        </button>
      </div>
    </div>
  );

  const renderClinicianDashboard = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-h2 mb-4">Client Overview</h2>
        <p className="text-warm-gray mb-4">Manage your client list and insights</p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-beige rounded-card flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Client {i}</h4>
                <p className="text-sm text-warm-gray">Last activity: 2 days ago</p>
              </div>
              <Link to="/messages" className="btn-primary">View</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-h3 mb-4">Share Resources</h3>
        <p className="mb-4">Link to tutorials and educational materials</p>
        <button className="btn-secondary">Browse Resources</button>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-h2 mb-4">Platform Overview</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-beige rounded-card text-center">
            <p className="text-3xl font-bold text-navy">247</p>
            <p className="text-sm text-warm-gray">Active Users</p>
          </div>
          <div className="p-4 bg-beige rounded-card text-center">
            <p className="text-3xl font-bold text-navy">52</p>
            <p className="text-sm text-warm-gray">Tutorials</p>
          </div>
          <div className="p-4 bg-beige rounded-card text-center">
            <p className="text-3xl font-bold text-navy">1,234</p>
            <p className="text-sm text-warm-gray">Messages Sent</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link to="/content" className="btn-primary">Manage Content</Link>
          <button className="btn-secondary">User Management</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-h3 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="p-3 bg-beige rounded-card text-sm">
            <p><strong>New user registered:</strong> John Doe (Older Adult)</p>
            <p className="text-xs text-warm-gray">2 hours ago</p>
          </div>
          <div className="p-3 bg-beige rounded-card text-sm">
            <p><strong>Tutorial completed:</strong> Video Calling Basics</p>
            <p className="text-xs text-warm-gray">5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const dashboardMap = {
    [ROLES.OLDER_ADULT]: renderOlderAdultDashboard,
    [ROLES.FAMILY]: renderFamilyDashboard,
    [ROLES.PSW_CAREGIVER]: renderPSWDashboard,
    [ROLES.CLINICIAN]: renderClinicianDashboard,
    [ROLES.ADMIN]: renderAdminDashboard
  };

  const renderDashboard = dashboardMap[profile.role] || renderOlderAdultDashboard;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-display mb-6">{t('home.welcome')}, {profile.full_name}!</h1>
      {renderDashboard()}
    </div>
  );
}
