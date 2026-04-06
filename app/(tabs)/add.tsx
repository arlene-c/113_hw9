import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CameraView from 'expo-camera/build/CameraView';
import { PermissionResponse, useCameraPermissions } from 'expo-camera';
import { ResizeMode, Video } from 'expo-av';
import { useAuth } from '../context/AuthContext';
import { addDictionaryEntry } from '../lib/storage';
import { DictionaryEntry } from '../lib/types';

type MediaCapture = {
  uri: string;
  type: 'photo' | 'video';
};

export default function AddScreen() {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [media, setMedia] = useState<MediaCapture | null>(null);
  const [definition, setDefinition] = useState('');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const { userEmail } = useAuth();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    } else if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is required to add signs.');
    }
  }, [permission, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      if (mode === 'photo') {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        setMedia({ uri: photo.uri, type: 'photo' });
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({ maxDuration: 15, mute: true });
        setIsRecording(false);
        setMedia({ uri: video.uri, type: 'video' });
      }
    } catch (error) {
      Alert.alert('Capture failed', 'Unable to capture media. Please try again.');
      setIsRecording(false);
    }
  }, [mode]);

  const stopRecording = useCallback(() => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleSave = async () => {
    if (!userEmail) {
      Alert.alert('Not signed in', 'Please log in first.');
      return;
    }

    if (!media) {
      Alert.alert('No sign captured', 'Take a photo or record a short video before saving.');
      return;
    }

    if (!definition.trim()) {
      Alert.alert('Definition required', 'Please add a word or phrase to define the sign.');
      return;
    }

    try {
      setSaving(true);
      const entry: DictionaryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        uri: media.uri,
        type: media.type,
        definition: definition.trim(),
        createdAt: new Date().toISOString(),
      };
      await addDictionaryEntry(userEmail, entry);
      setSuccessMessage('ASL sign added successfully.');
      setMedia(null);
      setDefinition('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      Alert.alert('Save failed', 'Unable to save the sign. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Requesting camera permission…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraCard}>
        {media ? (
          media.type === 'photo' ? (
            <Image source={{ uri: media.uri }} style={styles.preview} />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={styles.preview}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          )
        ) : (
          <CameraView
            ref={(ref) => {
              cameraRef.current = ref;
            }}
            style={styles.preview}
            facing="front"
            ratio="16:9"
          />
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.sectionTitle}>Capture new sign</Text>
        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]}
            onPress={() => setMode('photo')}
          >
            <Text style={[styles.modeButtonText, mode === 'photo' && styles.modeButtonTextActive]}>Photo</Text>
          </Pressable>
          <Pressable
            style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]}
            onPress={() => setMode('video')}
          >
            <Text style={[styles.modeButtonText, mode === 'video' && styles.modeButtonTextActive]}>Video</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Enter sign meaning or phrase"
          placeholderTextColor="#8e697f"
          value={definition}
          onChangeText={setDefinition}
          multiline
        />

        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.captureButton, isRecording && styles.captureButtonRecording]}
            onPress={mode === 'video' && isRecording ? stopRecording : handleCapture}
          >
            <Text style={styles.captureButtonText}>{mode === 'video' ? (isRecording ? 'Stop' : 'Record') : 'Capture'}</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save sign'}</Text>
          </Pressable>
        </View>

        {media ? (
          <Pressable style={styles.retakeButton} onPress={() => setMedia(null)}>
            <Text style={styles.retakeButtonText}>Retake media</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7f9',
  },
  cameraCard: {
    margin: 20,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffd5e2',
    backgroundColor: '#fdf1f6',
  },
  preview: {
    width: '100%',
    minHeight: 300,
    backgroundColor: '#000',
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#612340',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff5f8',
    borderRadius: 16,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#ff9cc9',
  },
  modeButtonText: {
    color: '#8b5a72',
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  textInput: {
    minHeight: 80,
    backgroundColor: '#fff1f7',
    borderColor: '#f3d4df',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    color: '#3b2133',
    marginBottom: 12,
  },
  successText: {
    color: '#1d6d3b',
    marginBottom: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#d91e7e',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  captureButtonRecording: {
    backgroundColor: '#c12739',
  },
  captureButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#ffd369',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#4b2a3c',
    fontWeight: '700',
  },
  retakeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#9f4b71',
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7f9',
  },
  statusText: {
    color: '#7b5b70',
    fontSize: 16,
  },
});
