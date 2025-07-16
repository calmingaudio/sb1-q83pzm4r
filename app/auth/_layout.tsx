// app/auth/_layout.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';
import BackButton from '@/components/BackButton';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
        headerLeft: () => (
          <View style={{ marginLeft: 8 }}>
            <BackButton color="#ffffff" />
          </View>
        ),
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }}  
      />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}