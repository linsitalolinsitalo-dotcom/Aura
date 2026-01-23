
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signup(name, identifier, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-zinc-950 flex items-center justify-center p-6 z-[100]">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-slate-500">Junte-se à jornada Aura.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Seu Nome</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Ex: João Silva"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail ou CPF</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Seu identificador único"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Escolha uma Senha</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="No mínimo 6 caracteres"
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:scale-[0.98] transition-transform"
          >
            {isSubmitting ? 'Criando...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="text-center text-slate-500">
          Já tem conta? <Link to="/login" className="text-blue-600 font-bold">Entrar</Link>
        </p>
      </div>
    </div>
  );
};
