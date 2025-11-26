'use client';

import { useAuth } from '@/contexts/AuthContext';
import Feed from '@/components/Feed';
import UserDropdown from '@/components/UserDropdown';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Universidad PuroPollo</h1>
                <p className="text-sm text-gray-500">Plataforma Educativa</p>
              </div>
            </div>

            {/* UserDropdown - Siempre visible */}
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Contenido del feed */}
      <div className="py-8">
        <Feed />
      </div>
    </div>
  );
}