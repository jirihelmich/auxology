import { Menu } from 'lucide-react';

interface TopNavProps {
  onToggleSidebar: () => void;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center">
      <button
        onClick={onToggleSidebar}
        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>
    </nav>
  );
}
