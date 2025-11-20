import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function SignIn() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4" style={{ backgroundColor: '#E8DCC2' }}>
      <div className="max-w-md w-full">
        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 className="text-center mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#132A49' }}>{t('app.name')}</h1>
          <p className="text-center mb-8" style={{ color: '#C8C3BD' }}>{t('app.tagline')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" style={{ borderRadius: '12px' }} role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#132A49' }}>
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#132A49' }}>
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #C8C3BD', borderRadius: '12px', minHeight: '44px' }}
                required
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-secondary w-full"
              style={{ width: '100%', backgroundColor: '#132A49', color: '#FFFFFF', padding: '12px 24px', borderRadius: '16px', fontWeight: '600', minHeight: '44px', border: 'none', cursor: 'pointer' }}
            >
              {loading ? t('common.loading') : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#132A49' }}>
              {t('auth.dontHaveAccount')}{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-semibold hover:underline"
                style={{ color: '#132A49', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {t('auth.signUp')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
