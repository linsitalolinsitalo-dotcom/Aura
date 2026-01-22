
import { UserProfile, DayLog } from '../types';

const USER_KEY = 'aura_user_profile';
const LOGS_KEY = 'aura_daily_logs';

export const storage = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  saveUser: (profile: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  },
  getLogs: (): Record<string, DayLog> => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : {};
  },
  saveLogs: (logs: Record<string, DayLog>) => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },
  getDayLog: (date: string): DayLog => {
    const logs = storage.getLogs();
    if (logs[date]) return logs[date];
    return {
      date,
      waterLogs: [],
      meals: [],
      notes: ''
    };
  },
  saveDayLog: (log: DayLog) => {
    const logs = storage.getLogs();
    logs[log.date] = log;
    storage.saveLogs(logs);
  }
};
