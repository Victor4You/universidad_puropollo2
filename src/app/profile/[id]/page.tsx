// src/app/profile/[id]/page.tsx
import ProfileContainer from "@/components/profile/ProfileContainer";
import { UserProfile } from "@/lib/types/user.types";
import { UserDropdown } from '@/components/auth/UserDropdown/UserDropdown';
import Link from 'next/link';

// Esta es una función de simulación (Reemplaza con tu DB después)
async function getMockUser(id: string): Promise<UserProfile> {
  return {
    id: id,
    name: "Leonard Snyder",
    email: "user@gmail.com",
    role: "admin", // Prueba cambiando a 'student' o 'teacher'
    avatar: null,
    createdAt: "2025-01-01T00:00:00Z",
  };
}

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const user = await getMockUser(id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Responsivo (Adaptado de tu HomePage) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            
            {/* Logo Responsivo */}
            <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm lg:text-lg">U</span>
              </div>
              {/* Oculto en móviles muy pequeños, visible en desktop */}
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                  Universidad PuroPolio
                </h1>
                <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider">
                  Perfil de Usuario
                </p>
              </div>
            </Link>

            {/* Menú de Usuario */}
            <div className="flex-shrink-0">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6">
        <ProfileContainer user={user} />
      </main>
    </div>
  );
}