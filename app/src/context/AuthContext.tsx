import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from "expo-router";

// Context에 담길 데이터의 타입 정의
interface AuthContextType {
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  isSignedIn: boolean;
  isLoading: boolean;
}

// Context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// 다른 컴포넌트에서 쉽게 Context를 사용할 수 있게 해주는 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 앱 전체를 감싸서 인증 상태를 제공해주는 Provider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 처리 함수
  const signIn = async (token: string) => {
    await AsyncStorage.setItem('accessToken', token);
    setSignedIn(true);
    // 화면 이동은 _layout.tsx가 담당하므로 여기서는 상태만 변경합니다.
  };

  // 로그아웃 처리 함수
  const signOut = async () => {
    await AsyncStorage.removeItem('accessToken');
    setSignedIn(false);
  };
  
  // 앱이 처음 시작될 때, AsyncStorage에 토큰이 있는지 확인
  useEffect(() => {
    const checkToken = async () => {
      try {
        // ========================================================
        // 👇 개발용 강제 로그아웃 코드 (배포 전 반드시 삭제!)
        await AsyncStorage.removeItem('accessToken');
        // ========================================================

        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setSignedIn(true);
        }
      } catch (e) {
        console.error("Failed to load token", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);


  const value = {
    signIn,
    signOut,
    isSignedIn,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
