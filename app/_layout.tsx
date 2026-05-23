import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sos" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
