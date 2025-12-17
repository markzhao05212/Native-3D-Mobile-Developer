# 🤖 React Native 3D AI Avatar

An interactive mobile application featuring a real-time 3D talking avatar with text-to-speech (TTS) synchronization and user session management. Built with React Native, Expo, and Three.js.

## 📱 Demo
![Demo Video](link_to_your_video_here) 
*(Add your AwesomeScreenshot link here)*

## 🚀 Features
- **3D Rendering:** High-performance rendering of GLB avatars using `@react-three/fiber` and `@react-three/drei`.
- **Real-Time Lipsync:** Custom animation logic synchronizing 3D morph targets (ARKit blendshapes) with TTS audio.
- **Session Management:** Unique `uuid` generation per user session.
- **Cross-Platform Audio:** Custom `expo-av` configuration to force audio playback on iOS Silent Mode.
- **Optimized Performance:** Draconic compression support and frame-loop optimization.

## 🛠 Tech Stack
- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **3D Engine:** Three.js / React Three Fiber
- **Audio:** Expo Speech & Expo AV
- **State:** React Hooks (useState, useRef)

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/react-native-lipsync-avatar.git](https://github.com/your-username/react-native-lipsync-avatar.git)
   cd react-native-lipsync-avatar