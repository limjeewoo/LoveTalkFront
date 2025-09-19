import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api"; 

export default function FindIdScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundId, setFoundId] = useState(""); // 👈 찾은 아이디를 저장할 상태

  // 아이디 찾기 버튼 핸들러
  const handleFindId = async () => {
    if (!email) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setFoundId(""); // 이전 결과가 있다면 초기화
    try {
      // 백엔드에 아이디 찾기 요청
      const response = await api.post("/users/find-id", { email });
      
      // 👈 성공 시, Alert 대신 상태에 마스킹된 아이디를 저장
      const maskedId = response.data.data.loginId;
      setFoundId(maskedId);

    } catch (error: any) {
      // 실패 시, 백엔드가 보낸 에러 메시지를 보여줌
      if (error.response?.data?.message) {
        Alert.alert("오류", error.response.data.message);
      } else {
        Alert.alert("오류", "아이디를 찾는 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 화면 타이틀 및 구분선 */}
      <Text style={styles.headerTitle}>아이디 찾기</Text>
      <View style={styles.headerDivider} />

      <View style={styles.formContainer}>
        <Text style={styles.infoText}>
          가입 시 등록한 이메일 주소를 입력하시면,
        </Text>
        <Text style={styles.infoText}>
          아이디의 일부를 알려드립니다.
        </Text>

        {/* 이메일 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* 아이디 찾기 버튼 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFindId}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>아이디 찾기</Text>
          )}
        </TouchableOpacity>

        {/* --- 👇 아이디 찾기 결과 표시 영역 --- */}
        {foundId ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>회원님의 아이디는</Text>
            <Text style={styles.resultId}>{foundId}</Text>
            <Text style={styles.resultLabel}>입니다.</Text>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.loginButtonText}>로그인하러 가기</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    paddingHorizontal: 24,
    justifyContent: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingTop: 25,
    paddingBottom: 24,
  },
  headerDivider: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    width: '100%',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: "#F24369",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // --- 👇 결과 표시를 위한 새로운 스타일 ---
  resultContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
  },
  resultId: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F24369',
    marginVertical: 10,
  },
  loginButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F24369',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#F24369',
    fontSize: 16,
    fontWeight: '600',
  }
});

