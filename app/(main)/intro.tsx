import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

// 5가지 언어를 배열로 관리하여 코드를 더 깔끔하게 만듭니다.
const LANGUAGES = ["인정하는 말", "함께하는 시간", "봉사", "스킨십", "선물"];

export default function IntroScreen() {
  const router = useRouter();

  const goToTest = () => {
    router.push("/questions");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        
        <Text style={styles.title}>
          사람마다 유독 더 크게 와닿는 '사랑의 언어'가 있습니다.
        </Text>

        <View style={styles.languageContainer}>
          {LANGUAGES.map((language) => (
            // 각 언어를 View(컨테이너)와 Text(내용)으로 분리합니다.
            <View key={language} style={styles.languageTag}>
              <Text style={styles.languageText}>{language}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.questionText}>
          당신은 어떤 언어로 사랑을 느낄 때 가장 행복한가요?
        </Text>

        <Text style={styles.subText}>
          지금 바로 당신의 제1 사랑의 언어를 확인해보세요.
        </Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={goToTest}>
        <Text style={styles.actionButtonText}>테스트하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    lineHeight: 32,
    marginBottom: 35,
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  languageTag: { // 컨테이너 스타일
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 6,
    // 컨테이너 안의 내용물을 중앙 정렬합니다.
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: { // 텍스트 스타일
    fontSize: 16,
    color: "#666",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#444",
    lineHeight: 26,
    marginBottom: 15,
    marginTop: 40,
  },
  subText: {
    fontSize: 16,
    color: "#888",
    marginBottom: -50,
  },
  actionButton: {
    backgroundColor: "#F24369",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 250,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

