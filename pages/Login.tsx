
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-zinc-950 flex items-center justify-center p-6 z-[100]">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Aura Health</h1>
          <p className="text-slate-500">Seu diário de bem-estar inteligente.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail ou CPF</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              placeholder="Digite seu identificador"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold text-lg shadow-lg hover:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-slate-500">
          Não tem uma conta? <Link to="/signup" className="text-blue-600 font-bold">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};
