import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../hooks/useUser';
import { useDatabase } from '../contexts/DatabaseContext';
import { useT } from '../i18n/LanguageContext';
import { Spinner } from '../components/ui/Spinner';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function RegisterPage() {
  const { create } = useUser();
  const { loading } = useDatabase();
  const { t } = useT();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error(t.registerFillFields);
      return;
    }
    setSubmitting(true);
    try {
      await create(username, password);
      toast.success(t.registerSuccess);
      navigate('/login');
    } catch (err) {
      if (err instanceof Error && err.message === 'USERNAME_EXISTS') {
        toast.error(t.registerUsernameTaken);
      } else {
        console.error('User creation failed:', err);
        toast.error(t.registerError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-4">nerost</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.registerTitle}</h3>
          <p className="text-sm text-gray-500 mb-6">{t.registerSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={t.loginPlaceholderUsername}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={t.loginPlaceholderPassword}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2.5 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {t.registerButton}
            </button>

            <p className="text-xs text-gray-500">{t.registerHasAccount}</p>
            <Link
              to="/login"
              className="block w-full border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              {t.registerLogin}
            </Link>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-6">&copy; 2016–2026</p>
      </div>
    </div>
  );
}
