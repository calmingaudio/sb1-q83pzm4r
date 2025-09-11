import { Stack } from 'expo-router';
import { View } from 'react-native';
import BackButton from '@/components/BackButton';

export default function QuestionnaireLayout() {
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
      <Stack.Screen name="name" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="pre-flight" />
      <Stack.Screen name="during-flight" />
      <Stack.Screen name="last-flight" />
      <Stack.Screen name="fears" />
    </Stack>
  );
}