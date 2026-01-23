
import { UserAccount } from '../types';

const ACCOUNTS_KEY = 'aura_accounts';
const SESSION_KEY = 'aura_session';

// Simple "hash" for demonstration (In production, use real backend)
const hashPassword = (pwd: string) => btoa(pwd).split('').reverse().join('');

export const authService = {
  getAccounts: (): Record<string, UserAccount> => {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : {};
  },

  register: async (name: string, identifier: string, password: string): Promise<UserAccount> => {
    const accounts = authService.getAccounts();
    if (accounts[identifier]) throw new Error("Usuário já cadastrado.");

    const newUser: UserAccount = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      identifier,
      passwordHash: hashPassword(password)
    };

    accounts[identifier] = newUser;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return newUser;
  },

  login: async (identifier: string, password: string): Promise<UserAccount> => {
    const accounts = authService.getAccounts();
    const user = accounts[identifier];

    if (!user || user.passwordHash !== hashPassword(password)) {
      throw new Error("Credenciais inválidas.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentSession: (): UserAccount | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
};
