import { Stack } from 'expo-router';

export default function QuestionnaireLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="name" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="pre-flight" />
      <Stack.Screen name="during-flight" />
      <Stack.Screen name="last-flight" />
      <Stack.Screen name="fears" />
    </Stack>
  );
}