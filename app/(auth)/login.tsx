import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator, // 👈 로딩 아이콘을 위해 추가
} from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api"; // 👈 API 클라이언트 import
import { useAuth } from "../../app/src/context/AuthContext"; // 👈 useAuth 훅 import

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth(); // 👈 AuthContext의 signIn 함수를 가져옵니다.
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 👈 로딩 상태 추가

  const handleLogin = async () => {
    if (!loginId || !password) {
      Alert.alert("알림", "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      // 1. 백엔드에 로그인 요청
      const response = await api.post("/users/login", {
        loginId: loginId,
        password: password,
      });

      const accessToken = response.data.data.accessToken;

      if (accessToken) {
        // 2. 로그인 성공 시, signIn 함수를 호출하여 전역 상태를 업데이트합니다.
        // 이제 화면 이동은 _layout.tsx가 알아서 처리해 줄 것입니다.
        await signIn(accessToken);
      } else {
        // 토큰이 없는 경우의 예외 처리
        Alert.alert("로그인 실패", "인증 정보가 올바르지 않습니다.");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("로그인 실패", error.response.data.message);
      } else {
        Alert.alert("로그인 실패", "서버와 통신 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 로고 영역 */}
      <View style={styles.upperSection}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* 하단 입력 폼 영역 */}
      <View style={styles.lowerSection}>
        {/* 아이디 입력 */}
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#999"
          value={loginId}
          onChangeText={setLoginId}
          autoCapitalize="none"
        />

        {/* 비밀번호 입력 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* 아이디 찾기 | 비밀번호 찾기 */}
        <View style={styles.findContainer}>
          <TouchableOpacity onPress={() => router.push("/find-id")}>
            <Text style={styles.findText}>아이디 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => router.push("/reset-password-step1")}>
            <Text style={styles.findText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>로그인</Text>
          )}
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  upperSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lowerSection: {
    flex: 2,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 70,
    resizeMode: "contain",
    borderWidth: 3,
    borderColor: '#e9b7c2ff',

  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  findContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  findText: {
    color: "#666",
    fontSize: 14,
  },
  divider: {
    marginHorizontal: 8,
    color: "#aaa",
  },
  loginBtn: {
    backgroundColor: "#F24369",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerBtn: {
    borderWidth: 1,
    borderColor: "#F24369",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  registerText: {
    color: "#F24369",
    fontSize: 16,
    fontWeight: "600",
  },
});

