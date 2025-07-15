import type { Notice } from '@/apis/notice';
import { fetchNoticeById } from '@/apis/notice';
import Header from '@/components/Header/CommonHeader';
import { useNoticeContext } from '@/context/NoticeContext';
import { markNoticeAsRead } from '@/utils/noticeReadStorage';
import { hp, px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import RenderHTML, { MixedStyleRecord } from 'react-native-render-html';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoticeDetailScreen() {
  const { noticeId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [notice, setNotice] = useState<Notice | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { refetchNotices } = useNoticeContext();

  // ✅ 항상 위에서 선언 (조건문 안에서 훅 금지)
  const cleanedHtml = useMemo(() => {
    if (!notice?.content) return '';
    return notice.content.replace(/※ 자세한 내용은 첨부파일을 참고 부탁드립니다\./g, '');
  }, [notice?.content]);

  const htmlSource = useMemo(() => ({ html: cleanedHtml }), [cleanedHtml]);

  const tagsStyles: MixedStyleRecord = useMemo(() => ({
    p: {
      fontFamily: 'Pretendard-Regular',
      fontWeight: '400',
      fontSize: px(24),
      lineHeight: px(34),
      color: theme.colors.gray[900],
    },
    span: {
      fontFamily: 'Pretendard-Regular',
      fontWeight: '400',
      fontSize: px(24),
      lineHeight: px(34),
      color: theme.colors.gray[900],
    },
    div: {
      marginBottom: 8,
    },
  }), [theme]);

  useEffect(() => {
    const getNotice = async () => {
      const data = await fetchNoticeById(Number(noticeId));
      setNotice(data);

      if (data?.noticeId) {
        await markNoticeAsRead(data.noticeId);
        await refetchNotices();
      }
    };
    getNotice();
  }, [noticeId]);

  if (!notice) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      <Header title="공지사항" onPressLeft={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: px(20) }}>
        <Text
          style={{
            fontSize: px(26),
            fontFamily: 'Pretendard-SemiBold',
            lineHeight: px(44),
            color: theme.colors.gray[900],
            fontWeight: '600',
          }}
        >
          {`🚨${notice.title}`}
        </Text>
        <Text
          style={{
            fontSize: px(20),
            fontFamily: 'Pretendard-Regular',
            lineHeight: px(32),
            color: theme.colors.gray[400],
            fontWeight: '400',
          }}
        >
          {dayjs(notice.createdAt).format('YYYY. MM. DD. A HH:mm')}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.gray[300],
            marginVertical: hp(20),
          }}
        />
        <RenderHTML
          contentWidth={width}
          source={htmlSource}
          ignoredDomTags={['font']}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
