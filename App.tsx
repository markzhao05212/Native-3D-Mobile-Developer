import React, { Suspense, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, LogBox, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; // Session ID generator

LogBox.ignoreAllLogs();

// --- 3D AVATAR ---
function Avatar({ isSpeaking }: { isSpeaking: boolean }) {
  const { scene } = useGLTF(require('./assets/avatar.glb'));
  const faceParts = useRef<any[]>([]);

  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.morphTargetDictionary) {
        faceParts.current.push(node);
      }
    });
  }, [scene]);

  useFrame((state) => {
    const targetOpen = isSpeaking ? (Math.sin(state.clock.elapsedTime * 20) + 1) / 2 : 0;
    const smoothness = 0.5; 

    faceParts.current.forEach((part) => {
      const dict = part.morphTargetDictionary;
      const influences = part.morphTargetInfluences;
      const index = dict['viseme_aa'] !== undefined ? dict['viseme_aa'] : dict['mouthOpen'];
      if (index !== undefined) {
        influences[index] = influences[index] + (targetOpen - influences[index]) * smoothness;
      }
    });
  });

  return <primitive object={scene} scale={1.9} position={[0, -3, 0]} />;
}

// --- MAIN APP ---
export default function App() {
  const [text, setText] = useState("I am ready for the interview.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // 1. GENERATE SESSION ID (Assessment Requirement)
    const id = uuidv4().slice(0, 8); // Generate a short unique ID
    setSessionId(id.toUpperCase());

    // 2. AUDIO SETUP
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error("Audio error", e);
      }
    }
    configureAudio();
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'en',
        rate: 0.9,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER WITH SESSION ID */}
      <View style={styles.header}>
        <Text style={styles.sessionText}>🔴 LIVE SESSION: {sessionId}</Text>
      </View>

      {/* 3D WORLD */}
      <Canvas camera={{ position: [0, 0.3, 1.4] }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <spotLight position={[0, 5, 2]} intensity={1} />
        
        {/* Simple Background Environment */}
        <Environment preset="sunset" /> 
        
        <Suspense fallback={null}>
          <Avatar isSpeaking={isSpeaking} />
          {/* Shadow on the floor */}
          <ContactShadows position={[0, -3, 0]} opacity={0.7} scale={10} blur={2} far={4} />
        </Suspense>
      </Canvas>

      {/* CONTROLS */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Enter message..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity onPress={handleSpeak} style={[styles.button, isSpeaking && styles.buttonStop]}>
            <Text style={styles.buttonText}>{isSpeaking ? "STOP" : "SPEAK"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#202025' },
  header: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  sessionText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'bold' },
  keyboardView: { position: 'absolute', bottom: 40, width: '100%', paddingHorizontal: 20 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 5, elevation: 5 },
  input: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 12 },
  buttonStop: { backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});




