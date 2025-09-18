// 파일 경로: app/_layout.tsx

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// 가상의 로그인 확인 로직 (나중에 실제 로직으로 교체)
const useAuth = () => {
  return { isSignedIn: false }; 
};

// 이 컴포넌트가 실질적인 라우팅 로직을 담당합니다.
function RootLayoutNav() {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // 로그인 상태인데 (auth) 그룹에 있다면 메인으로 보냄
      router.replace('/'); 
    } else if (!isSignedIn && !inAuthGroup) {
      // 비로그인 상태인데 (auth) 그룹 밖에 있다면 로그인으로 보냄
      router.replace('/login');
    }
  }, [isSignedIn, segments]);

  // Slot이 현재 경로에 맞는 자식 레이아웃을 렌더링합니다.
  return <Slot />;
}

// 이 컴포넌트가 앱의 진정한 시작점입니다.
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 여기에 폰트 로딩, 스플래시 스크린 숨기기 등
    // 앱이 시작되기 전에 필요한 모든 비동기 작업을 넣습니다.
    // 지금은 1초간 대기하는 것으로 시뮬레이션합니다.
    setTimeout(() => {
      setIsReady(true);
    }, 1000);
  }, []);

  // 준비가 안됐으면 로딩 화면을 보여줍니다.
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 모든 준비가 끝나면, 라우팅 로직이 담긴 컴포넌트를 렌더링합니다.
  return <RootLayoutNav />;
}