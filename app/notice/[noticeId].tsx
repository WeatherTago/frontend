import type { Notice } from '@/apis/notice';
import { fetchNoticeById } from '@/apis/notice';
import Header from '@/components/Header/CommonHeader';
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
  const removeFooterNote = (html: string) => {
  return html.replace(/※ 자세한 내용은 첨부파일을 참고 부탁드립니다\./g, '');
};


  useEffect(() => {
    const getNotice = async () => {
      const data = await fetchNoticeById(Number(noticeId ));
      setNotice(data);
    };
    getNotice();
  }, [noticeId ]);

  if (!notice) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="공지사항" onPressLeft={() => router.back()} />
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold',marginBottom: 10  }}>{notice.title}</Text>
        <Text style={{ fontSize:16, color: '#999', marginBottom: 15 }}>
          {dayjs(notice.createdAt).format('YYYY. MM. DD. A HH:mm')}
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: removeFooterNote(notice.content) }}
          ignoredDomTags={['font']}
          tagsStyles={{
            p: {
              fontSize: 18,
              lineHeight: 24,
              color: '#333',
            },
            span: {
              fontSize: 18,
              lineHeight: 24,
              color: '#333',
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