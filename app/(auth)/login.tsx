import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image, // Image 컴포넌트를 import 합니다.
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: 백엔드 로그인 API 연동
    console.log("로그인 시도:", loginId, password);
    router.replace("/intro"); // 로그인 성공 시 메인 그룹의 intro 화면으로 이동
  };

  return (
    <View style={styles.container}>
      {/* 상단 로고 영역 */}
      <View style={styles.upperSection}>
        <Image
          source={require("../../assets/logo.png")} // 올바른 상대 경로로 수정했습니다.
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
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push("/register")} // (auth) 그룹 내에서는 경로를 간단히 씁니다.
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
    justifyContent: 'flex-end', // 로고를 상단 영역의 맨 아래로 보냅니다.
  },
  lowerSection: {
    flex: 2, // 하단 영역이 상단보다 더 많은 공간을 차지하게 합니다.
    paddingHorizontal: 24,
    justifyContent: 'center', // 입력 폼을 하단 영역의 중앙에 위치시킵니다.
  },
  logo: {
    width: 100, // 로고 크기 조정
    height: 100, // 로고 크기 조정
    marginBottom: 70, // 로고와 하단 영역 사이의 최소 간격
    resizeMode: "contain",
    //borderRadius: 60, // 원형 테두리를 위해 너비/높이의 절반 값
    borderWidth: 3,   // 테두리 두께
    borderColor: '#e9b7c2ff', // 테두리 색상 (연한 회색)
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

