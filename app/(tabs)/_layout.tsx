import { hp, px, wp } from '@/utils/scale';
import * as Font from 'expo-font';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmIcon from '../../assets/images/alarm.png';
import HomeIcon from '../../assets/images/home.png';
import MapIcon from '../../assets/images/map.png';
import TrainIcon from '../../assets/images/subway.png';
import UserIcon from '../../assets/images/user.png';
import { theme } from '../../styles/theme';

const icons = {
  index: HomeIcon,
  alert: AlarmIcon,
  congestion: MapIcon,
  information: TrainIcon,
  mypage: UserIcon,
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = Font.useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('@/assets/fonts/Pretendard-ExtraBold.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: hp(82) + insets.bottom,
          backgroundColor: theme.colors.gray[0],
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: px(4), height: 0 },
          shadowOpacity: 0.05,
          shadowRadius: px(4),
          elevation: 4,
        },
        tabBarIcon: ({ focused }) => {
          const label = getLabel(route.name);
          const tintColor = focused ? theme.colors.primary[700] : theme.colors.gray[300];
          const iconSource = icons[route.name as keyof typeof icons];
          const isSmallIcon = route.name === 'index' || route.name === 'mypage';

          return (
            <View style={styles.tabItem}>
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  {
                    tintColor,
                    width: isSmallIcon ? px(30) : px(38),
                    height: isSmallIcon ? px(30) : px(38),
                    marginTop: isSmallIcon ? 28 : 25,
                  },
                ]}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                style={[
                  styles.label,
                  {
                    color: tintColor,
                    marginTop: route.name === 'index' || route.name === 'mypage' ? hp(4) : 0,
                  },
                ]}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="alert" />
      <Tabs.Screen name="congestion" />
      <Tabs.Screen name="information" />
      <Tabs.Screen name="mypage" />
      <Tabs.Screen name="favorite-modal" options={{ href: null }} />
    </Tabs>
  );
}

function getLabel(name: string) {
  switch (name) {
    case 'index':
      return '홈';
    case 'alert':
      return '알림설정';
    case 'congestion':
      return '혼잡예측';
    case 'information':
      return '편의시설';
    case 'mypage':
      return 'MY';
    case 'favorite-modal':
      return '즐겨찾는 역';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(108),
    paddingTop: hp(14),
  },
  icon: {
    width: px(38),
    height: px(38),
    marginTop: 25,
  },
  label: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight as any,
    fontFamily: theme.fonts.pretendard.regular,
    textAlign: 'center',
    color: theme.colors.gray[300],
  },
});
