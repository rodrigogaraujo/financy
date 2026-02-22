import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserRoundPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, loginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Inputs group + Links row */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className={errors.email ? 'text-danger' : 'text-gray-700'}>
            E-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="mail@exemplo.com"
              className="pl-10 h-12 rounded-lg border-gray-300"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className={errors.password ? 'text-danger' : 'text-gray-700'}>
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              className="pl-10 pr-10 h-12 rounded-lg border-gray-300"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
              Lembrar-me
            </label>
          </div>
          <Link to="#" className="text-sm font-medium text-brand-base hover:underline">
            Recuperar senha
          </Link>
        </div>
      </div>

      {error && <p className="text-danger text-sm text-center">{error}</p>}

      <Button
        type="submit"
        disabled={loginLoading}
        className="h-12 rounded-lg bg-brand-base hover:bg-brand-dark text-white font-medium"
      >
        {loginLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">ou</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Sign up section */}
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600 text-center">Ainda não tem uma conta?</p>

        <Button
          type="button"
          variant="outline"
          asChild
          className="h-12 rounded-lg border-gray-300 hover:bg-gray-50 font-medium text-gray-700"
        >
          <Link to="/register">
            <UserRoundPlus className="h-[18px] w-[18px] mr-2" />
            Criar conta
          </Link>
        </Button>
      </div>
    </form>
  );
}
