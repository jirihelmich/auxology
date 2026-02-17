import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { Spinner } from '../components/ui/Spinner';

export function LoginPage() {
  const { signIn } = useAuth();
  const { loading } = useDatabase();
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
        toast.error('Přihlášení selhalo. Zkontrolujte své přihlašovací údaje.');
      } else {
        navigate('/patients/dashboard');
      }
    } catch {
      toast.error('Neočekávaná chyba aplikace.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Monitoring růstu nedonošených dětí</h2>
            <p className="text-gray-600 text-sm mb-3">
              Tento program pro sledování růstu nedonošených dětí je založen na referenčních růstových
              (auxologických) datech a percentilových růstových grafech pro monitorování růstu
              nedonošených dětí v ČR.
            </p>
            <p className="text-gray-600 text-sm">
              Percentilové grafy a referenční data jsou založena na zpracování souboru auxologických
              dat 1781 dětí (846 dívek, 935 chlapců) vyšetřovaných ve věku od 37. týdne do 109. týdne
              GA v Centru komplexní péče KDDL VFN Praha v letech 2001 až 2015. Celkem bylo statisticky
              zpracováno 5676 vyšetření (využita metoda LMS kvantilové regrese).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                Přihlásit se
              </button>
              <Link
                to="/register"
                className="block text-center w-full border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Vytvořit účet
              </Link>
            </form>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-4">
            &copy; 2016–2026 RNDr. Jiří Helmich &middot; odborný dohled: doc. RNDr. Hana Krásničanová CSc
            &middot; statistické zpracování dat: Mgr. Marie Hladíková
          </p>
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-xs text-gray-500 mb-3">
              Tento program byl podpořen v rámci projektu &quot;Nové metody v následné péči o děti s perinatální
              zátěží v CKP KDDL VFN&quot;, reg.&nbsp;č.&nbsp;NF&#8209;CZ11&#8209;OV&#8209;1&#8209;009&#8209;2015.
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Podpořeno grantem z Norska. Supported by a grant from Norway.
            </p>
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
