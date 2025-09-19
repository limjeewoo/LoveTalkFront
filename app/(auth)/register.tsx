import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator, // 로딩 아이콘을 위해 추가
} from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api"; // 👈 API 클라이언트 import

// --- 유효성 검사 함수 ---
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateId = (id: string) => {
  const regex = /^[a-zA-Z0-9]{6,20}$/;
  return regex.test(id);
};

// 👈 비밀번호 유효성 검사 함수 추가
const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/;
  return regex.test(password);
};

export default function RegisterScreen() {
  const router = useRouter();

  // 입력 값 상태 관리
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 유효성 검사 에러 메시지 상태
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  // 중복 확인 여부 상태 관리
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  // --- onBlur 핸들러 (입력창 포커스 잃었을 때 유효성 검사) ---
  const handleIdBlur = () => {
    if (id && !validateId(id)) {
      setIdError("아이디는 영문, 숫자를 사용하여 6~20자로 입력해주세요.");
    } else {
      setIdError("");
    }
  };
  
  // 👈 비밀번호 onBlur 핸들러 추가
  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setPasswordError("비밀번호는 영문, 숫자를 포함하여 8~20자로 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else if (password && validatePassword(password)) {
      // 비밀번호가 유효성 검사를 통과했을 때만 에러 메시지를 지웁니다.
      setPasswordError("");
    }
  };
  
  const handleBirthDateChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setBirthDate(filteredText);
  };

  // --- API 연동 핸들러 ---

  // 아이디 중복 확인 핸들러 (API 연동)
  const handleCheckId = async () => {
    if (!id || !validateId(id)) {
      Alert.alert("알림", "아이디는 영문, 숫자를 사용하여 6~20자로 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/users/check-id', { loginId: id });
      Alert.alert("알림", "사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    } catch (error: any) {
      setIsIdChecked(false);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("알림", error.response.data.message);
      } else {
        Alert.alert("오류", "서버와 통신 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 중복 확인 핸들러 (API 연동)
  const handleCheckEmail = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert("알림", "올바른 이메일 형식이 아닙니다.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/users/check-email', { email: email });
      Alert.alert("알림", "사용 가능한 이메일입니다.");
      setIsEmailChecked(true);
    } catch (error: any) {
      setIsEmailChecked(false);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("알림", error.response.data.message);
      } else {
        Alert.alert("오류", "서버와 통신 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 핸들러 (API 연동)
  const handleRegister = async () => {
    if (!isIdChecked) {
      Alert.alert("알림", "아이디 중복 확인을 완료해주세요.");
      return;
    }
    if (!isEmailChecked) {
      Alert.alert("알림", "이메일 중복 확인을 완료해주세요.");
      return;
    }
    if (idError || emailError || passwordError || !validatePassword(password)) {
      Alert.alert("알림", "입력 정보를 다시 확인해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!id || !password || !email || !gender || !birthDate) {
        Alert.alert("알림", "모든 항목을 입력해주세요.");
        return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/users/signup', {
        loginId: id,
        password: password,
        email: email,
        gender: gender.toUpperCase(), // "male" -> "MALE"
        birthDate: birthDate,
      });

      if (response.data.success) {
        Alert.alert("성공", "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("회원가입 실패", error.response.data.message);
      } else {
        Alert.alert("회원가입 실패", "서버와 통신 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.headerTitle}>회원가입</Text>
      <View style={styles.headerDivider} />

      <View style={styles.formContainer}>
        {/* 아이디 입력 */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputRow, idError ? styles.inputError : null]}>
            <TextInput
              style={styles.inputWithButton}
              placeholder="아이디 (영문, 숫자 6~20자)"
              placeholderTextColor="#999"
              value={id}
              onChangeText={(text) => {
                setId(text);
                setIsIdChecked(false);
                if (idError) setIdError("");
              }}
              onBlur={handleIdBlur}
              maxLength={20}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.checkButton} onPress={handleCheckId} disabled={isLoading}>
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.errorText}>{idError || ""}</Text>
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="비밀번호 (영문, 숫자 포함 8~20자)"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={(text)=>{
              setPassword(text);
              if(passwordError) setPasswordError("");
            }}
            onBlur={handlePasswordBlur}
            maxLength={20}
          />
          <Text style={styles.errorText}>{passwordError || ""}</Text>
        </View>
        
        {/* 비밀번호 확인 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="비밀번호 확인"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text)=>{
              setConfirmPassword(text);
              if(passwordError) setPasswordError("");
            }}
            onBlur={handleConfirmPasswordBlur}
            maxLength={20}
          />
          <Text style={styles.errorText}>{passwordError || ""}</Text>
        </View>

        {/* 이메일 입력 */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputRow, emailError ? styles.inputError : null]}>
            <TextInput
              style={styles.inputWithButton}
              placeholder="이메일"
              placeholderTextColor="#999"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => {
                setEmail(text);
                setIsEmailChecked(false);
                if(emailError) setEmailError("");
              }}
              onBlur={handleEmailBlur}
            />
            <TouchableOpacity style={styles.checkButton} onPress={handleCheckEmail} disabled={isLoading}>
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.errorText}>{emailError || ""}</Text>
        </View>

        {/* 성별 선택 */}
        <View style={styles.genderContainer}>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'male' && styles.radioSelected]} 
            onPress={() => setGender('male')}
          >
            <Text style={[styles.radioText, gender === 'male' && styles.radioTextSelected]}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'female' && styles.radioSelected]} 
            onPress={() => setGender('female')}
          >
            <Text style={[styles.radioText, gender === 'female' && styles.radioTextSelected]}>여자</Text>
          </TouchableOpacity>
        </View>

        {/* 생년월일 입력 */}
        <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="생년월일 (8자리, 예: 19990101)"
              placeholderTextColor="#999"
              value={birthDate}
              onChangeText={handleBirthDateChange}
              keyboardType="number-pad"
              maxLength={8}
            />
            <View style={{height: 18}} />
        </View>
        
        {/* 회원가입 버튼 */}
        <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerText}>회원가입</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  inputContainer: {
    marginBottom: 12, // 간격을 일정하게 조정
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    height: 18, // 레이아웃 밀림 방지를 위해 높이 고정
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#F24369',
    backgroundColor: 'rgba(242, 67, 105, 0.1)',
  },
  radioText: {
    fontSize: 16,
    color: '#666',
  },
  radioTextSelected: {
    color: '#F24369',
    fontWeight: '600'
  },
  registerBtn: {
    backgroundColor: "#F24369",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

