export type DictionaryEntry = {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  definition: string;
  createdAt: string;
};

type UserCredentials = {
  email: string;
  passwordHash: string;
};

export type AuthState = {
  userEmail: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
