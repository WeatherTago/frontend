import Header from '@/components/Header/CommonHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useNoticeContext } from '@/context/NoticeContext';
import { markNoticeAsRead } from '@/utils/noticeReadStorage';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const { notices, readIds, refetchNotices } = useNoticeContext(); 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      <Header title="공지사항" onPressLeft={() => router.back()} />

      <FlatList
        data={notices}
        keyExtractor={(item) => `${item.noticeId}`}
        renderItem={({ item }) => {
          const isNew = dayjs().diff(dayjs(item.createdAt), 'day') <= 2;
          const isRead = readIds.includes(item.noticeId);

          return (
            <TouchableOpacity
              onPress={async () => {
                await markNoticeAsRead(item.noticeId);
                await refetchNotices();
                router.push(`../notice/${item.noticeId}`);
              }}
            >
              <NoticeBanner
                text={`🚨${item.title}`}
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
      />
    </SafeAreaView>
  );
}
