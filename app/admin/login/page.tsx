import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-sm px-4 relative z-10">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
              <span className="text-lg font-bold text-white">LX3</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-100">Growth OS</h1>
            <p className="text-sm text-zinc-500 mt-1">Ingresa a tu cuenta</p>
          </div>
          <Suspense
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-zinc-800 rounded-lg" />
                <div className="h-10 bg-zinc-800 rounded-lg" />
                <div className="h-10 bg-zinc-800 rounded-lg" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-6">
          Plataforma de gestión comercial by LX3
        </p>
      </div>
    </div>
  );
}
