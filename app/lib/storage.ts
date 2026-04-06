import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { DictionaryEntry } from './types';

const CURRENT_USER_KEY = 'asl-current-user';
const USER_CREDENTIAL_PREFIX = 'asl-user-';

export async function getCurrentUserEmail(): Promise<string | null> {
  return await AsyncStorage.getItem(CURRENT_USER_KEY);
}

export async function setCurrentUserEmail(email: string): Promise<void> {
  await AsyncStorage.setItem(CURRENT_USER_KEY, email);
}

export async function clearCurrentUserEmail(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function hashEmail(email: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, email);
}

export async function storeUserCredentials(email: string, passwordHash: string): Promise<void> {
  const hashedEmail = await hashEmail(email);
  await SecureStore.setItemAsync(`${USER_CREDENTIAL_PREFIX}${hashedEmail}`, passwordHash, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function getStoredPasswordHash(email: string): Promise<string | null> {
  const hashedEmail = await hashEmail(email);
  return await SecureStore.getItemAsync(`${USER_CREDENTIAL_PREFIX}${hashedEmail}`);
}

export async function hasAccount(email: string): Promise<boolean> {
  const hash = await getStoredPasswordHash(email);
  return Boolean(hash);
}

const dictionaryKey = async (email: string) => {
  const hashedEmail = await hashEmail(email);
  return `@asl-dictionary:${hashedEmail}`;
};

export async function loadDictionaryEntries(email: string): Promise<DictionaryEntry[]> {
  const key = await dictionaryKey(email);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const items = JSON.parse(raw) as DictionaryEntry[];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function saveDictionaryEntries(email: string, entries: DictionaryEntry[]): Promise<void> {
  const key = await dictionaryKey(email);
  await AsyncStorage.setItem(key, JSON.stringify(entries));
}

export async function addDictionaryEntry(email: string, entry: DictionaryEntry): Promise<void> {
  const existing = await loadDictionaryEntries(email);
  const key = await dictionaryKey(email);
  await AsyncStorage.setItem(key, JSON.stringify([entry, ...existing]));
}

export async function removeDictionaryEntry(email: string, id: string): Promise<void> {
  const existing = await loadDictionaryEntries(email);
  const key = await dictionaryKey(email);
  await AsyncStorage.setItem(key, JSON.stringify(existing.filter((item) => item.id !== id)));
}
