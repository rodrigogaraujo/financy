import { RegisterForm } from '@/components/auth/register-form';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 pt-12 gap-8">
      <img src="/logo.svg" alt="Financy" className="h-8" />

      <div className="w-full max-w-[448px] rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="text-xl font-bold text-gray-800 text-center w-full">
            Criar conta
          </h2>
          <p className="text-base text-gray-600 text-center w-full">
            Preencha seus dados para se cadastrar
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
