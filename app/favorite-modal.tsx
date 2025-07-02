import Header from '@/components/Header/CommonHeader';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoriteModal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="즐겨찾는 역" onPressLeft={() => router.back()} />


      {/* 즐겨찾기 목록 */}
      <View style={styles.content}>
        <Text style={styles.emptyText}>임시 내용</Text>
        {/* FlatList로 즐겨찾기 목록 표시 가능 */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});
