"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/Loader/Loader";
import { UserDropdown } from "@/components/auth/UserDropdown/UserDropdown";
import Link from "next/link";
import Image from "next/image"; // Ajuste: Importación para fondo responsivo
import dynamic from "next/dynamic";
import LoginView from "@/components/auth/LoginView";

const Feed = dynamic(() => import("@/components/Feed"), {
  loading: () => <Loader text="Cargando feed..." />,
  ssr: false,
});

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth(); // Ajuste: Extraemos 'user' para el saludo
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Cargando..." />
      </div>
    );
  }

  // SI NO ESTÁ AUTENTICADO: Mostramos la VISTA de login con FONDO RESPONSIVO
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Ajuste: Contenedor de Imagen de Fondo */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/images/baner_inicio.png"
            alt="Fondo Universidad"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />{" "}
          {/* Overlay para legibilidad */}
        </div>

        <div className="z-10 w-full flex justify-center">
          <LoginView />
        </div>
      </main>
    );
  }

  // SI ESTÁ AUTENTICADO: Mostramos el Feed (Manteniendo tu estructura original)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div
          className={`${isMobile ? "px-3" : "max-w-7xl mx-auto px-4 lg:px-8"}`}
        >
          <div className="flex justify-between items-center h-14 lg:h-16">
            <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm lg:text-lg">
                  U
                </span>
              </div>
              {!isMobile && (
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                    Universidad PuroPollo
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 hidden lg:block">
                    Plataforma Educativa
                  </p>
                </div>
              )}
            </Link>

            {/* Ajuste: Saludo personalizado al lado del dropdown */}
            <div className="flex items-center space-x-4">
              {!isMobile && user && (
                <span className="text-sm text-gray-600">
                  Hola,{" "}
                  <span className="font-semibold text-blue-600">
                    {user.name}
                  </span>
                </span>
              )}
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
      <main className="py-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Feed />
        </div>
      </main>
    </div>
  );
}
