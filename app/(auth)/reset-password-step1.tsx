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

export default function ResetPasswordStep1Screen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부 상태

  // 인증번호 요청 핸들러
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/users/password/send-code", { email });
      Alert.alert("알림", "인증번호가 이메일로 발송되었습니다.");
      setIsCodeSent(true); // 인증번호 입력창을 보여주도록 상태 변경
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("오류", error.response.data.message);
      } else {
        Alert.alert("오류", "인증번호 발송 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 및 다음 단계로 이동 핸들러
  const handleVerifyCodeAndProceed = async () => {
    if (!code) {
      Alert.alert("알림", "인증번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/users/password/verify-code", { email, code });
      const tempToken = response.data.data.tempToken;

      // 성공 시, 임시 토큰을 가지고 2단계 화면으로 이동
      router.push({
        pathname: "/reset-password-step2",
        params: { token: tempToken }, // 👈 파라미터로 토큰 전달
      });

    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("오류", error.response.data.message);
      } else {
        Alert.alert("오류", "인증번호 확인 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>비밀번호 찾기</Text>
      <View style={styles.headerDivider} />

      <View style={styles.formContainer}>
        {/* 이메일 입력 섹션 */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputWithButton}
            placeholder="이메일"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isCodeSent} // 코드 발송 후에는 수정 불가
          />
          {!isCodeSent && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={handleSendCode}
              disabled={isLoading}
            >
              <Text style={styles.checkButtonText}>인증요청</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 인증번호 입력 섹션 (isCodeSent가 true일 때만 보임) */}
        {isCodeSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="인증번호 6자리"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVerifyCodeAndProceed}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>다음</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
        padding: 24,
        justifyContent: "center",
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
        marginBottom: 50,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 30,
    },
    inputWithButton: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
    },
    checkButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#F24369'
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
        marginBottom: 30,
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
});

