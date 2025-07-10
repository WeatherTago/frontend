import { fetchNotices, Notice } from '@/apis/notice';
import Header from '@/components/Header/CommonHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const theme = useTheme();

  useEffect(()=>{
    const getData = async () =>{
      const data=await fetchNotices();
      setNotices(data);
    };
    getData();
  }, []);

  const isNew = (createdAt: string) => {
  const createdDate = new Date(createdAt.slice(0, 10));
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = (todayDateOnly.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 2;
};


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="공지사항" onPressLeft={() => router.back()} />

        <FlatList
          data={notices}
          keyExtractor={(item) => `${item.noticeId}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 12 }}
                onPress={() =>
                  router.push(`../notice/${item.noticeId}`)
                }
              >
                <NoticeBanner
                  text={item.title}
                  date={dayjs(item.createdAt).format('YYYY. MM. DD. A HH:mm')}
                  backgroundColor="#FFF"
                  textColor={theme.colors.gray[900]}
                  showArrowButton
                  isNew={isNew(item.createdAt)}
                />
            </TouchableOpacity>
      )}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
