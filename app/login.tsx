import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, userEmail, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!isLoading && userEmail) {
      router.replace('/dictionary' as any);
    }
  }, [isLoading, userEmail, router]);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setWorking(true);
      await signIn(email, password);
      router.replace('/dictionary' as any);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Login failed.';
      setError(message);
      Alert.alert('Login failed', message);
    } finally {
      setWorking(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff5f8' }}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your ASL dictionary.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#8c7086"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#8c7086"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={working}>
          {working ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log in</Text>}
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Need an account?</Text>
          <Pressable onPress={() => router.push('/signup' as any)}>
            <Text style={styles.footerLink}>Sign up</Text>
          </Pressable>
        </View>
      </View>      </KeyboardAvoidingView>    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f8',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2d1129',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#7b5b70',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#a3406d',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff1f6',
    borderColor: '#f3d4df',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: '#2d1129',
  },
  button: {
    backgroundColor: '#f8a7c1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    gap: 8,
  },
  footerText: {
    color: '#7b5b70',
  },
  footerLink: {
    color: '#e91e63',
    fontWeight: '700',
  },
  error: {
    color: '#c72c41',
    marginBottom: 12,
    fontWeight: '600',
  },
});
