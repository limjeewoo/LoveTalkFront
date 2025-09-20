import { View, Text, StyleSheet } from 'react-native';

export default function MainHomeScreen() {
  // 이 화면이 로그인 후 사용자가 보게 될 메인 콘텐츠의 시작점입니다.
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 후 메인 화면입니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
  },
});
