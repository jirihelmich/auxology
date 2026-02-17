import { NavLink, useNavigate } from 'react-router-dom';
import { Users, BarChart3, UserCog, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePerson } from '../../hooks/usePerson';
import { useEffect, useState } from 'react';
import type { Person } from '../../types/database';

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { signOut } = useAuth();
  const { getCurrentDoctor } = usePerson();
  const [doctor, setDoctor] = useState<Person | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentDoctor().then(setDoctor);
  }, [getCurrentDoctor]);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const doctorName = doctor
    ? [doctor.titlePrefix, doctor.firstName, doctor.lastName, doctor.titlePostfix].filter(Boolean).join(' ')
    : '';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-lg mx-2 ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#2f4050] text-white z-30 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-4 border-b border-white/10">
        {!collapsed && (
          <div className="text-center">
            <h3 className="text-lg font-semibold">Auxology</h3>
            {doctorName && <p className="text-xs text-gray-400 mt-1">{doctorName}</p>}
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1">
        <NavLink to="/patients/dashboard" className={linkClass}>
          <Users size={18} />
          {!collapsed && <span>Pacienti</span>}
        </NavLink>
        <NavLink to="/charts" className={linkClass}>
          <BarChart3 size={18} />
          {!collapsed && <span>Grafy</span>}
        </NavLink>
      </nav>

      <div className="border-t border-white/10 py-4 space-y-1">
        <NavLink to="/doctor/profile" className={linkClass}>
          <UserCog size={18} />
          {!collapsed && <span>Profil</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-lg mx-2 w-[calc(100%-1rem)]"
        >
          <LogOut size={18} />
          {!collapsed && <span>Odhlásit</span>}
        </button>
      </div>
    </aside>
  );
}
