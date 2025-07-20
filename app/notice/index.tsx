import Header from '@/components/Header/CommonHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useNoticeContext } from '@/context/NoticeContext';
import { markNoticeAsRead } from '@/utils/noticeReadStorage';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const { notices, isNewUnreadExists, loading: noticeLoading,readIds, refetchNotices } = useNoticeContext();

useEffect(() => {
  if (!noticeLoading) {

    if (!notices || notices.length === 0) {
      console.log('🔄 공지사항 리패치 실행');
      refetchNotices();
    }
  }
}, [noticeLoading]);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      <Header title="공지사항" onPressLeft={() => router.back()} />

      <FlatList
        data={notices}
        keyExtractor={(item) => `${item.noticeId}`}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        renderItem={({ item }) => {
          const isNew = dayjs().diff(dayjs(item.createdAt), 'day') <= 2;
          const isRead = readIds.includes(item.noticeId);

          return (
            <TouchableOpacity
              onPress={async () => {
                await markNoticeAsRead(item.noticeId);
                router.push(`../notice/${item.noticeId}`);
              }}
            >
              <NoticeBanner
                text={item.title}
                date={dayjs(item.createdAt).format('YYYY. MM. DD. A HH:mm')}
                backgroundColor={
                  isNew && !isRead
                    ? theme.colors.primary[100]
                    : '#FFF'
                }
                textColor={theme.colors.gray[900]}
                showArrowButton
              />
            </TouchableOpacity>
          );
        }}
        // ✅ 비어있을 때 안내 문구
        ListEmptyComponent={
          <NoticeBanner
            text="📭 아직 등록된 공지사항이 없습니다"
            backgroundColor={theme.colors.gray[100]}
            textColor={theme.colors.gray[400]}
            showArrowButton={false}
          />
        }
      />
    </SafeAreaView>
  );
} 
