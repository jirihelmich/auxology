import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../hooks/useUser';
import { useDatabase } from '../contexts/DatabaseContext';
import { Spinner } from '../components/ui/Spinner';

export function RegisterPage() {
  const { create } = useUser();
  const { loading } = useDatabase();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Vyplňte prosím uživatelské jméno a heslo.');
      return;
    }
    setSubmitting(true);
    try {
      await create(username, password);
      toast.success('Účet vytvořen. Nyní se přihlaste.');
      navigate('/login');
    } catch (err) {
      if (err instanceof Error && err.message === 'USERNAME_EXISTS') {
        toast.error('Uživatelské jméno je již obsazeno.');
      } else {
        console.error('User creation failed:', err);
        toast.error('Neočekávaná chyba při vytváření účtu.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">nerost</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vytvořit účet</h3>
          <p className="text-sm text-gray-500 mb-6">Pro práci s pacienty je třeba vytvoření nového účtu.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Uživatelské jméno"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Heslo"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2.5 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              Vytvořit účet
            </button>

            <p className="text-xs text-gray-500">Pokud již účet máte:</p>
            <Link
              to="/login"
              className="block w-full border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Přihlaste se
            </Link>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-6">&copy; 2016–2026</p>
      </div>
    </div>
  );
}
