import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">LX3</h1>
            <p className="text-sm text-gray-500 mt-1">Growth OS</p>
          </div>
          <Suspense
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-200 rounded-lg" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
