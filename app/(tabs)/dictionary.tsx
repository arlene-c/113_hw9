import { useFocusEffect } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loadDictionaryEntries } from '../lib/storage';
import { DictionaryEntry } from '../lib/types';

export default function DictionaryScreen() {
  const router = useRouter();
  const { userEmail, signOut } = useAuth();
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!userEmail) {
      setEntries([]);
      return;
    }
    const loaded = await loadDictionaryEntries(userEmail);
    setEntries(loaded);
  }, [userEmail]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  if (entries === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#be1f6f" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My ASL Dictionary</Text>
        <Pressable onPress={() => signOut()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No signs yet</Text>
          <Text style={styles.emptyDescription}>
            Start by adding a photo or video of a sign and give it a definition. Your dictionary will appear here.
          </Text>
          <Pressable style={styles.addNowButton} onPress={() => router.push('add' as any)}>
            <Text style={styles.addNowText}>Add first sign</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`entry/${item.id}` as any)}
            >
              <View style={styles.thumbnailContainer}>
                {item.type === 'photo' ? (
                  <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
                ) : (
                  <Video
                    source={{ uri: item.uri }}
                    style={styles.thumbnailImage}
                    shouldPlay={false}
                    isMuted
                    resizeMode={ResizeMode.COVER}
                  />
                )}
              </View>
              <Text style={styles.entryDefinition} numberOfLines={2}>{item.definition}</Text>
            </Pressable>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadEntries();
            setRefreshing(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff7f9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4f1f3c',
    fontFamily: 'Georgia',
  },
  logoutButton: {
    backgroundColor: '#ffd9ef',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  logoutText: {
    color: '#7d3d5b',
    fontWeight: '700',
  },
  emptyState: {
    marginTop: 32,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#fff0e3',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6c2a47',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f5064',
    textAlign: 'center',
    marginBottom: 20,
  },
  addNowButton: {
    backgroundColor: '#ff90c0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  addNowText: {
    color: '#fff',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    minWidth: '48%',
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: '#fff4f7',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  thumbnailContainer: {
    height: 120,
    borderRadius: 18,
    backgroundColor: '#ffe4f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 42,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  entryDefinition: {
    fontSize: 16,
    color: '#552b42',
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7f9',
  },
});
