import { AuthProvider } from '@/context/AuthContext';
import { makeServer } from '@/services/mirage/server';
import { Stack } from 'expo-router';
import { Server } from 'miragejs';

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__ && typeof globalThis.window !== 'undefined') {
  if (!globalThis.window.server) {
    globalThis.window.server = makeServer();
  }
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
