import { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UserRound, Mail, LogOut } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AuthContext } from '@/contexts/auth-context';
import { UPDATE_PROFILE } from '@/graphql/mutations';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === user?.name) return;
    try {
      const { data } = await updateProfile({
        variables: { input: { name: name.trim() } },
      });
      if (data?.updateProfile && user) {
        const updated = { ...user, name: data.updateProfile.name };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4 md:p-12 flex flex-col items-center gap-8">
        <div className="w-full max-w-[448px] rounded-xl border border-gray-200 bg-white p-6 md:p-8 flex flex-col gap-8">
          {/* Header: avatar + name + email */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-300">
              <span className="text-2xl font-medium text-gray-800">{initials}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 w-full">
              <h2 className="text-xl font-semibold leading-7 text-gray-800 text-center">
                {user?.name}
              </h2>
              <p className="text-base text-gray-500 text-center">{user?.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-9 pr-3 border border-gray-300 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative opacity-50">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full h-12 pl-9 pr-3 border border-gray-300 rounded-lg text-base text-black bg-white cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500">O e-mail não pode ser alterado</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading || !name.trim() || name.trim() === user?.name}
                className="w-full h-12 rounded-lg bg-brand-base hover:bg-brand-dark text-white text-base font-medium"
              >
                {loading ? 'Salvando...' : 'Atualizar perfil'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
                className="w-full h-12 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 text-base font-medium gap-2"
              >
                <LogOut className="h-[18px] w-[18px] text-danger" />
                Sair da conta
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
