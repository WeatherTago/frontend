import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { sendPushToken } from '@/apis/alarm';
import DirectAccessCard from '@/components/DirectAccessCard';
import FavoriteStationCard from '@/components/Favorites/FavoriteStationCard';
import FavoriteStationSkeletonCard from '@/components/Favorites/FavoriteStationSkeletonCard';
import WeatherHeader from '@/components/Header/WeatherHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useFavorite } from '@/context/FavoriteContext';
import { useNoticeContext } from '@/context/NoticeContext';
import { useFavoriteCongestionFetcher } from '@/hooks/useFavoriteCongestionFetcher';
import { theme } from '@/styles/theme';
import { StationResult } from '@/types/station';
import { hp, px, wp } from '@/utils/scale';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = px(400);
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { fetch } = useFavoriteCongestionFetcher();
  const [favoriteStations, setFavoriteStations] = useState<StationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const { notices, isNewUnreadExists, loading: noticeLoading } = useNoticeContext();
  const latestNotice = notices.length > 0 ? notices[0] : null;
  const { favoriteStationIds } = useFavorite();
  const isFocused = useIsFocused();

  const sendExpoPushToken = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== Notifications.PermissionStatus.GRANTED) {
      Alert.alert('알림 권한 필요', '알림을 받기 위해 권한을 허용해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId,
    });

    const expoPushToken = token.data;
    const encodedToken = expoPushToken.replace(/\[/g, '%5B').replace(/\]/g, '%5D');

    if (Device.isDevice) {
      try {
        await sendPushToken(encodedToken);
      } catch (error) {
        console.error('❌ 푸시 토큰 전송 실패:', JSON.stringify(error));
      }
    }
  };

  useEffect(() => {
    sendExpoPushToken();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const response = await fetch();
      setFavoriteStations(response);
      setIsLoading(false);
    };
    loadData();
  }, [isFocused, favoriteStationIds, noticeLoading]);

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.gray[50] }}>
      <WeatherHeader showAlarmDot={isNewUnreadExists} />

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.gray[50] }]}>
        {noticeLoading || !latestNotice ? (
          <NoticeBanner
            text="최신 공지를 확인하세요"
            showArrowButton
            onPressArrow={() => router.push('../notice')}
            backgroundColor={theme.colors.gray[700]}
            textColor={theme.colors.gray[0]}
          />
        ) : (
          <NoticeBanner
            text={latestNotice.title}
            showArrowButton
            onPressArrow={() => router.push(`../notice/${latestNotice.noticeId}`)}
            backgroundColor={theme.colors.gray[700]}
            textColor={theme.colors.gray[0]}
            date={dayjs(latestNotice.createdAt).format('YYYY. MM. DD. A HH:mm')}
          />
        )}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          오늘 즐겨찾는 역의 혼잡도는?
        </Text>
        {favoriteStations === null ? (
          <View style={[styles.cardListContainer, { flexDirection: 'row' }]}>
            {[0, 1, 2].map(index => (
              <View key={index} style={{ marginRight: wp(32) }}>
                <FavoriteStationSkeletonCard />
              </View>
            ))}
          </View>
        ) : favoriteStations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyImageAndTextContainer}>
              <Image
                source={require('@/assets/images/empty/subway-question-main.png')}
                style={styles.emptyImageContainer}
              />
              <Text style={styles.emptyText}>아직 즐겨찾는 역이 없어요</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => router.push('../favorite-modal')}
            >
              <Text style={styles.buttonText}>즐겨찾는 역 등록하러 가기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // 실제 FlatList
          <FlatList
            data={favoriteStations}
            keyExtractor={item => item.stationId.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + wp(32)} //스와이프 이동 거리
            contentContainerStyle={styles.cardListContainer}
            renderItem={({ item, index }) => (
              <View
                style={{
                  marginRight: index === favoriteStations.length - 1 ? 0 : wp(32), // 카드 간 시각적 간격, 마지막 카드에는 간격 없음
                }}
              >
                <FavoriteStationCard station={item} />
              </View>
            )}
          />
        )}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          지하철 편의시설 정보
        </Text>

        <DirectAccessCard
          title={
            <>
              편안한 이동을 위해 지하철 역의
              {'\n'}
              <Text style={{ color: theme.colors.primary[700] }}>엘리베이터 위치</Text>가 알고
              싶다면
            </>
          }
          subText="편의시설 정보를 빠르게 확인해보세요"
          buttonText="편의시설 확인하기"
          onPress={() => router.push('/information')}
          image={require('@/assets/images/elevator.png')}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          혼잡도 알림 설정
        </Text>

        <DirectAccessCard
          title={
            <>
              붐비는 시간대를 피하고 싶다면
              {'\n'}
              혼잡도를 <Text style={{ color: theme.colors.primary[700] }}>알림으로 간단하게</Text>
            </>
          }
          subText="즐겨찾는 역의 혼잡도를 알림으로 받아보세요"
          buttonText="알림 설정하기"
          onPress={() => router.push('/alert')}
          image={require('@/assets/images/homealarm.png')}
        />
        <View style={{height:px(30)}}/>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  sectionTitle: {
    paddingVertical: hp(30),
    paddingHorizontal: wp(24),
    fontSize: px(26),
    lineHeight: px(34),
  },
  cardListContainer: {
    paddingHorizontal: SIDE_SPACING,
  },
  emptyContainer: {
    height: hp(494),
    padding: hp(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(22),
    alignSelf: 'stretch',
  },
  emptyImageAndTextContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyImageContainer: {
    width: wp(250),
    height: hp(170),
  },
  emptyImage: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    color: theme.colors.gray[300],
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    fontSize: px(20),
    fontWeight: '600',
    paddingHorizontal: wp(28),
  },
  buttonContainer: {
    paddingVertical: px(10),
    paddingHorizontal: px(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(6),
    borderWidth: px(1),
    borderColor: theme.colors.gray[400],
    backgroundColor: theme.colors.gray[100],
  },
  buttonText: {
    color: theme.colors.gray[400],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(16),
    fontWeight: '500',
    lineHeight: px(16),
  },
});
