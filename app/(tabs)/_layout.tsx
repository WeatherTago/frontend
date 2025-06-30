import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';

import AlarmIcon from '../../assets/images/alarm.png';
import HomeIcon from '../../assets/images/home.png';
import MapIcon from '../../assets/images/map.png';
import TrainIcon from '../../assets/images/subway.png';
import UserIcon from '../../assets/images/user.png';

const icons = {
  index: HomeIcon,
  alert: AlarmIcon,
  congestion: MapIcon,
  information: TrainIcon,
  mypage: UserIcon,
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 82 + insets.bottom,
          backgroundColor: theme.colors.gray[0],
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
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
            width: isSmallIcon ? 26 : 30,
            height: isSmallIcon ? 26 : 30,
            marginTop: isSmallIcon ? 26 : 25,
          },
        ]}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[styles.label, { color: tintColor }]}
      >
        {label}
      </Text>
    </View>
  );
}

      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="alert" />
      <Tabs.Screen name="congestion" />
      <Tabs.Screen name="information" />
      <Tabs.Screen name="mypage" />
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
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 108,
    paddingTop: 14,
  },
  icon: {
    width: 30,
    height: 30,
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
