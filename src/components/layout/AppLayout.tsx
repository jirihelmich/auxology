import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useIdleLogout } from '../../hooks/useIdleLogout';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  useIdleLogout();

  return (
    <div className="min-h-screen bg-gray-bg print:bg-white">
      <div className="hidden-print">
        <Sidebar collapsed={collapsed} />
      </div>
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'} print:!ml-0`}>
        <div className="hidden-print">
          <TopNav onToggleSidebar={() => setCollapsed((c) => !c)} />
        </div>
        <main>
          <Outlet />
        </main>
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200 mt-8 hidden-print">
          <p>Podpořeno grantem z Norska. &copy; 2016–2026 RNDr. Jiří Helmich</p>
        </footer>
      </div>
    </div>
  );
}
