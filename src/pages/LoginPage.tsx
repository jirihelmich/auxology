import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useT } from '../i18n/LanguageContext';
import { Spinner } from '../components/ui/Spinner';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function LoginPage() {
  const { signIn } = useAuth();
  const { loading } = useDatabase();
  const { t } = useT();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await signIn(username, password);
      if (!user) {
        toast.error(t.loginFailed);
      } else {
        navigate('/patients/dashboard');
      }
    } catch {
      toast.error(t.unexpectedError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.loginTitle}</h2>
            <p className="text-gray-600 text-sm mb-3">{t.loginDescription1}</p>
            <p className="text-gray-600 text-sm">{t.loginDescription2}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                {t.loginButton}
              </button>
              <Link
                to="/register"
                className="block text-center w-full border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                {t.loginCreateAccount}
              </Link>
            </form>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: t.loginFooterCopyright }} />
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-xs text-gray-500 mb-3">{t.loginFooterGrant}</p>
            <p className="text-xs text-gray-500 mb-3">{t.loginFooterNorway}</p>
            <div className="flex items-center justify-center gap-6">
              <img src="./img/norsko.png" alt="Norsko" className="h-12" />
              <img src="./img/vfn.jpg" alt="VFN" className="h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
