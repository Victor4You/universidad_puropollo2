// src/app/layout.tsx
// =============================================
// LAYOUT PRINCIPAL DE LA APLICACIÓN
// =============================================

import { AuthProvider } from '@/contexts/AuthContext/AuthProvider';
import { FontProvider } from '@/providers/FontProvider';
import '@/styles/globals.css';
import { ProvidersWrapper } from '@/components/ProvidersWrapper';


/**
 * Layout raíz de la aplicación Next.js
 * 
 * @param children - Componentes hijos que se renderizarán dentro del layout
 * @returns Layout principal con proveedor de autenticación
 * 
 * @description
 * Este layout envuelve toda la aplicación con el proveedor de autenticación
 * y carga los estilos globales.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <FontProvider>
        {/* Proveedor de autenticación para toda la aplicación */}
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
        </FontProvider>
      </body>
    </html>
  );
}