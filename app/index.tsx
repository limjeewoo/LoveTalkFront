// 파일 경로: app/index.tsx
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>새 프로젝트 성공!</Text>
    </View>
  );
}