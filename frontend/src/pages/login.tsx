import { LoginForm } from '@/components/auth/login-form';

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 pt-12 gap-8">
      <img src="/logo.svg" alt="Financy" className="h-8" />

      <div className="w-full max-w-[448px] rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="text-xl font-bold text-gray-800 text-center w-full">
            Fazer login
          </h2>
          <p className="text-base text-gray-600 text-center w-full">
            Entre na sua conta para continuar
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
