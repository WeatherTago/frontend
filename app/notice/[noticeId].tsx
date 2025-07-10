import type { Notice } from '@/apis/notice';
import { fetchNoticeById } from '@/apis/notice';
import Header from '@/components/Header/CommonHeader';
import { markNoticeAsRead } from '@/utils/noticeReadStorage';
import { hp, px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoticeDetailScreen() {
  const { noticeId  } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [notice, setNotice] = useState<Notice | null>(null);
  const insets=useSafeAreaInsets();
  const router=useRouter();
  const theme=useTheme();
  const removeFooterNote = (html: string) => {
  return html.replace(/※ 자세한 내용은 첨부파일을 참고 부탁드립니다\./g, '');
};


  useEffect(() => {
    const getNotice = async () => {
      const data = await fetchNoticeById(Number(noticeId));
      setNotice(data);

      // ✅ 읽음 처리
      if (data?.noticeId) {
        await markNoticeAsRead(data.noticeId);
      }
    };
    getNotice();
  }, [noticeId]);
  if (!notice) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="공지사항" onPressLeft={() => router.back()} />
      <ScrollView 
        contentContainerStyle={{ padding: px(20), paddingBottom: insets.bottom }}>
        <Text style={{ 
          fontSize: px(26), 
          fontFamily:'Pretendard-SemiBold', 
          lineHeight:px(44), 
          color:theme.colors.gray[900],
          fontWeight: 600,
          }}>
           {`🚨${notice.title}`}
        </Text>
        <Text style={{ 
          fontSize:px(20), 
          fontFamily:'Pretendard-Regular', 
          lineHeight:px(32), 
          color: theme.colors.gray[400], 
          fontWeight: 400,
        }}>
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
          source={{ html: removeFooterNote(notice.content) }}
          ignoredDomTags={['font']}
          tagsStyles={{
            p: {
              fontFamily: 'Pretendard-Regular',
              fontWeight: 400,
              fontSize: px(24),
              lineHeight: px(34),
              color: theme.colors.gray[900],
            },
            span: {
              fontFamily: 'Pretendard-Regular',
              fontWeight: 400,
              fontSize: px(24),
              lineHeight: px(34),
              color: theme.colors.gray[900],
            },
            div: {
              marginBottom: 8,
            },
          }}
      />
      </ScrollView>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  }
})