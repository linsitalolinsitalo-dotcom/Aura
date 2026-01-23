
import { UserProfile, DayLog } from '../types';

const LEGACY_USER_KEY = 'aura_user_profile';
const LEGACY_LOGS_KEY = 'aura_daily_logs';

export const storage = {
  // Get keys based on userId
  getProfileKey: (uid: string) => `aura_user_${uid}_profile`,
  getLogsKey: (uid: string) => `aura_user_${uid}_logs`,

  getUser: (userId: string): UserProfile | null => {
    const data = localStorage.getItem(storage.getProfileKey(userId));
    return data ? JSON.parse(data) : null;
  },

  saveUser: (userId: string, profile: UserProfile) => {
    localStorage.setItem(storage.getProfileKey(userId), JSON.stringify(profile));
  },

  getLogs: (userId: string): Record<string, DayLog> => {
    const data = localStorage.getItem(storage.getLogsKey(userId));
    return data ? JSON.parse(data) : {};
  },

  saveLogs: (userId: string, logs: Record<string, DayLog>) => {
    localStorage.setItem(storage.getLogsKey(userId), JSON.stringify(logs));
  },

  getDayLog: (userId: string, date: string): DayLog => {
    const logs = storage.getLogs(userId);
    if (logs[date]) return logs[date];
    return {
      date,
      waterLogs: [],
      meals: [],
      notes: ''
    };
  },

  saveDayLog: (userId: string, log: DayLog) => {
    const logs = storage.getLogs(userId);
    logs[log.date] = log;
    storage.saveLogs(userId, logs);
  },

  // Migration logic
  migrateLegacyData: (newUserId: string): UserProfile | null => {
    const legacyProfile = localStorage.getItem(LEGACY_USER_KEY);
    const legacyLogs = localStorage.getItem(LEGACY_LOGS_KEY);

    if (legacyProfile) {
      const profile = JSON.parse(legacyProfile);
      storage.saveUser(newUserId, profile);
      localStorage.removeItem(LEGACY_USER_KEY);
      
      if (legacyLogs) {
        storage.saveLogs(newUserId, JSON.parse(legacyLogs));
        localStorage.removeItem(LEGACY_LOGS_KEY);
      }
      return profile;
    }
    return null;
  }
};
