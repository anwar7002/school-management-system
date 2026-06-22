import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🏫 School Management System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <nav className="w-64 bg-gray-800 text-white min-h-screen">
          <ul className="space-y-2 p-4">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                📊 Dashboard
              </a>
            </li>
            <li>
              <a
                href="/attendance"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                ✅ Attendance
              </a>
            </li>
            <li>
              <a
                href="/students"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                👨‍🎓 Students
              </a>
            </li>
            <li>
              <a
                href="/violations"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                ⚠️ Violations
              </a>
            </li>
            <li>
              <a
                href="/messages"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                💬 Messages
              </a>
            </li>
            <li>
              <a
                href="/schedules"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                📅 Schedules
              </a>
            </li>
            <li>
              <a
                href="/visitors"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                👥 Visitors
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};
