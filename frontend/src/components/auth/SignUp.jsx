import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = {
  OLDER_ADULT: 'older_adult',
  FAMILY: 'family',
  PSW_CAREGIVER: 'psw_caregiver',
  CLINICIAN: 'clinician',
  ADMIN: 'admin'
};

const ROLE_LABELS = {
  older_adult: 'Older Adult',
  family: 'Family / Friend',
  psw_caregiver: 'PSW / Caregiver',
  clinician: 'Clinician',
  admin: 'Admin / Coordinator'
};

export default function SignUp() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: ROLES.OLDER_ADULT
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#E8DCC2' }}>
      <div className="max-w-md w-full">
        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 className="text-center mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#132A49' }}>{t('auth.createAccount')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                {t('auth.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
              >
                {Object.entries(ROLES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {ROLE_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#132A49', color: '#FFFFFF', padding: '12px 24px', borderRadius: '16px', fontWeight: '600', minHeight: '44px', border: 'none', cursor: 'pointer' }}
            >
              {loading ? t('common.loading') : t('auth.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/signin')}
                style={{ color: '#132A49', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {t('auth.signIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
