import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { DictionaryEntry } from './types';

const CURRENT_USER_KEY = '@asl-current-user';
const USER_CREDENTIAL_PREFIX = '@asl-user-';

export async function getCurrentUserEmail(): Promise<string | null> {
  return await SecureStore.getItemAsync(CURRENT_USER_KEY);
}

export async function setCurrentUserEmail(email: string): Promise<void> {
  await SecureStore.setItemAsync(CURRENT_USER_KEY, email);
}

export async function clearCurrentUserEmail(): Promise<void> {
  await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
}

export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function storeUserCredentials(email: string, passwordHash: string): Promise<void> {
  await SecureStore.setItemAsync(`${USER_CREDENTIAL_PREFIX}${email}`, passwordHash, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function getStoredPasswordHash(email: string): Promise<string | null> {
  return await SecureStore.getItemAsync(`${USER_CREDENTIAL_PREFIX}${email}`);
}

export async function hasAccount(email: string): Promise<boolean> {
  const hash = await getStoredPasswordHash(email);
  return Boolean(hash);
}

const dictionaryKey = (email: string) => `@asl-dictionary:${email}`;

export async function loadDictionaryEntries(email: string): Promise<DictionaryEntry[]> {
  const raw = await AsyncStorage.getItem(dictionaryKey(email));
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
  await AsyncStorage.setItem(dictionaryKey(email), JSON.stringify(entries));
}

export async function addDictionaryEntry(email: string, entry: DictionaryEntry): Promise<void> {
  const existing = await loadDictionaryEntries(email);
  await saveDictionaryEntries(email, [entry, ...existing]);
}

export async function removeDictionaryEntry(email: string, id: string): Promise<void> {
  const existing = await loadDictionaryEntries(email);
  await saveDictionaryEntries(email, existing.filter((item) => item.id !== id));
}
