import { Stack } from 'expo-router';

export default function MainLayout() {
  // 이 Stack은 로그인 후 보게 될 화면들의 네비게이션을 관리합니다.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '메인 홈' }} />
      <Stack.Screen name="intro" options={{ title: '소개' }} />
      {/* 여기에 로그인 후 필요한 다른 화면들을 계속 추가할 수 있습니다. */}
    </Stack>
  );
}