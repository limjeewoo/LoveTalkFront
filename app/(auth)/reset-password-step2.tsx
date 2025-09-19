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
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../src/api";

export default function ResetPasswordStep2Screen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>(); // 👈 1단계에서 전달받은 토큰

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("알림", "새로운 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!token) {
        Alert.alert("오류", "인증 정보가 올바르지 않습니다. 다시 시도해주세요.");
        router.back();
        return;
    }

    setIsLoading(true);
    try {
      // 🚀 백엔드에 임시 토큰과 함께 비밀번호 변경 요청
      await api.post(
        "/users/password/reset",
        { newPassword: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 헤더에 임시 토큰 추가
          },
        }
      );

      Alert.alert("성공", "비밀번호가 성공적으로 변경되었습니다.", [
        { text: "로그인하러 가기", onPress: () => router.replace('/login') },
      ]);

    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("오류", error.response.data.message);
      } else {
        Alert.alert("오류", "비밀번호 변경 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>비밀번호 재설정</Text>
      <View style={styles.headerDivider} />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="새로운 비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>변경하기</Text>
          )}
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

