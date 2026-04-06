import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { userEmail, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && userEmail) {
      router.replace('/dictionary' as any);
    }
  }, [isLoading, userEmail, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff8fb' }}>
      <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.emoji}>👐</Text>
        <Text style={styles.heading}>ASL Memory</Text>
        <Text style={styles.description}>
          Build your own sign language dictionary with photos and short videos so you can review, practice, and remember each sign.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <Text style={styles.paragraph}>
          Sign up or log in, then add a captured photo or short video of a sign with the matching English meaning. Your personal dictionary will stay saved on your device.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/login' as any)}>
          <Text style={styles.primaryButtonText}>Log in</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/signup' as any)}>
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  heroCard: {
    borderRadius: 28,
    padding: 28,
    backgroundColor: '#ffe8f2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 6,
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 18,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: 'PlayfairDisplay-Regular',
    color: '#3f1a2f',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#69455a',
  },
  infoCard: {
    backgroundColor: '#fff1db',
    borderRadius: 22,
    padding: 22,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#643b48',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6f4b5f',
  },
  actions: {
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#ff93c2',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1b7d1',
  },
  secondaryButtonText: {
    color: '#9f556d',
    fontWeight: '700',
    fontSize: 16,
  },
});
