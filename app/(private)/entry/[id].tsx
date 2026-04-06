import { useFocusEffect } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { loadDictionaryEntries, removeDictionaryEntry } from '../../lib/storage';
import { DictionaryEntry } from '../../lib/types';

export default function EntryDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { userEmail } = useAuth();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<DictionaryEntry> | null>(null);

  const selectedId = typeof params.id === 'string' ? params.id : undefined;

  useFocusEffect(
    useCallback(() => {
      // Keep the current entries while this screen is focused.
      return undefined;
    }, [])
  );

  useEffect(() => {
    if (!userEmail) {
      return;
    }

    let mounted = true;
    (async () => {
      const loaded = await loadDictionaryEntries(userEmail);
      if (mounted) {
        setEntries(loaded);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userEmail]);

  useEffect(() => {
    if (!loading && selectedId && entries.length > 0) {
      const index = entries.findIndex((item) => item.id === selectedId);
      if (index >= 0 && listRef.current) {
        listRef.current.scrollToIndex({ index, animated: false });
      }
    }
  }, [entries, loading, selectedId]);

  const handleDelete = async (id: string) => {
    if (!userEmail) {
      return;
    }

    Alert.alert('Delete sign', 'This will permanently delete the selected sign from your dictionary.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeDictionaryEntry(userEmail, id);
          router.replace('/dictionary' as any);
        },
      },
    ]);
  };

  const selectedIndex = useMemo(
    () => entries.findIndex((item) => item.id === selectedId),
    [entries, selectedId]
  );

  const currentEntry = selectedIndex >= 0 ? entries[selectedIndex] : undefined;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.loader}>
          <Text style={styles.loadingText}>Loading sign…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentEntry) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.errorText}>This sign could not be found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.push('/dictionary' as any)}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push('/dictionary' as any)}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Practice</Text>
        <Pressable onPress={() => handleDelete(currentEntry.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={entries}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScrollToIndexFailed={(info) => {
          if (listRef.current) {
            listRef.current.scrollToOffset({ offset: width * info.index, animated: false });
          }
        }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.mediaWrapper}>
              <Text style={styles.photoLabel}>{item.type === 'photo' ? 'Photo Entry' : 'Video Entry'}</Text>
              {item.type === 'photo' ? (
                <View style={styles.mediaPlaceholder}>
                  <Image source={{ uri: item.uri }} style={styles.media} />
                </View>
              ) : (
                <Video
                  source={{ uri: item.uri }}
                  style={styles.media}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
              )}
            </View>
            <View style={styles.definitionCard}>
              <Text style={styles.definitionTitle}>Definition</Text>
              <Text style={styles.definitionText}>{item.definition}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.pagerInfo}>
        <Text style={styles.pagerText}>Slide left or right to review more signs.</Text>
      </View>
    </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7f9',
  },
  loadingText: {
    color: '#7b5b70',
    fontSize: 16,
  },
  errorText: {
    color: '#a63c61',
    padding: 24,
    fontSize: 18,
  },
  backButton: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#ffe3ee',
    borderRadius: 16,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#8b4c67',
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backText: {
    color: '#7c4460',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    color: '#4d1f3a',
    fontWeight: '800',
    fontFamily: 'Georgia',
  },
  deleteText: {
    color: '#c72c41',
    fontWeight: '700',
  },
  page: {
    width,
    padding: 18,
  },
  mediaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ffe4f3',
    marginBottom: 18,
  },
  photoLabel: {
    padding: 14,
    color: '#7d4360',
    fontWeight: '700',
  },
  mediaPlaceholder: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: '#fde5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: '#000',
  },
  definitionCard: {
    backgroundColor: '#fff1f5',
    borderRadius: 24,
    padding: 20,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    color: '#64354c',
  },
  definitionText: {
    fontSize: 16,
    color: '#5c2f48',
    lineHeight: 24,
  },
  pagerInfo: {
    padding: 16,
    alignItems: 'center',
  },
  pagerText: {
    color: '#826074',
  },
});
