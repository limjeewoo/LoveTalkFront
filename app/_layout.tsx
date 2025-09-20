import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../app/src/context/AuthContext'; // 👈 AuthProvider와 useAuth를 import

// 이 컴포넌트가 실질적인 라우팅 로직을 담당합니다.
function RootLayoutNav() {
  const { isSignedIn, isLoading } = useAuth(); // 👈 진짜 useAuth 훅 사용
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 로딩 중일 때는 아무것도 하지 않음
    if (isLoading) return; 

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // 로그인 상태인데 (auth) 그룹에 있다면 메인으로 보냄
      // TODO: 나중에 테스트 기록 여부에 따라 '/' 또는 '/intro'로 분기
      router.replace('/intro');
    } else if (!isSignedIn && !inAuthGroup) {
      // 비로그인 상태인데 (auth) 그룹 밖에 있다면 로그인으로 보냄
      router.replace('/login');
    }
  }, [isSignedIn, isLoading, segments]);

  // 인증 상태 확인 중에는 로딩 화면을 보여줌
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

// 이 컴포넌트가 앱의 진정한 시작점입니다.
export default function RootLayout() {
  return (
    // 👈 AuthProvider로 전체 앱을 감싸줍니다.
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

