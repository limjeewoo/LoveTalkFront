import { Stack } from 'expo-router';

export default function AuthLayout() {
  // Stack의 screenOptions를 사용해 이 그룹의 모든 화면 헤더를 숨깁니다.
  return <Stack screenOptions={{ headerShown: false }} />;
}

