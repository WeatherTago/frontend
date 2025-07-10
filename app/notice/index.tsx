import { fetchNotices, Notice } from '@/apis/notice';
import Header from '@/components/Header/CommonHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { getReadNoticeIds, markNoticeAsRead } from '@/utils/noticeReadStorage';
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
  const [readNoticeIds, setReadNoticeIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchNoticesData = async () => {
      const data = await fetchNotices(); // ✅ 전체 공지 목록 받아오기
      setNotices(data);
    };
    fetchNoticesData();
  }, []);

  useEffect(() => {
    const fetchRead = async () => {
      const ids = await getReadNoticeIds(); // ✅ 읽은 공지 목록 불러오기
      setReadNoticeIds(ids);
    };
    fetchRead();
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
        renderItem={({ item }) => {
          const newNotice = isNew(item.createdAt);
          const isRead = readNoticeIds.includes(item.noticeId);

          return (
            <TouchableOpacity
              onPress={async () => {
                await markNoticeAsRead(item.noticeId); // ✅ 읽음 저장
                setReadNoticeIds((prev) => [...prev, item.noticeId]); // ✅ UI 업데이트
                router.push(`../notice/${item.noticeId}`);
              }}
            >
              <NoticeBanner
                text={`🚨${item.title}`}
                date={dayjs(item.createdAt).format('YYYY. MM. DD. A HH:mm')}
                backgroundColor={
                  newNotice && !isRead
                    ? theme.colors.primary[100] // ✅ 새로운 + 안 읽음 → 강조
                    : '#FFF' // ✅ 이미 읽음 또는 오래된 → 기본 흰색
                }
                textColor={theme.colors.gray[900]}
                showArrowButton
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
