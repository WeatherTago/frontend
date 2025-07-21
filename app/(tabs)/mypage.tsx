import { readUser } from '@/apis/user';
import LargeButton from '@/components/Button/LargeButton';
import Header from '@/components/Header/CommonHeader';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { UserInfo } from '@/types/user';
import { hp, px, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyPageScreen() {
  const { logout, withdraw } = useAuth();
  const insets = useSafeAreaInsets();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleWithdraw = () => {
    Alert.alert('회원 탈퇴', '정말로 탈퇴하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {
          router.replace('/onboarding');
        },
      },
    ]);
  };
  const handleLogout = () => {
    Alert.alert('로그아웃', '정말로 로그아웃하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          const res = await withdraw();
          logout();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await readUser();
    setUserInfo(res.result);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="마이페이지" />
      <View style={styles.contentContainer}>
        <View style={styles.infoAndImageContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/profile-image.png')} style={styles.image} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.userNameText}>
                {userInfo?.nickname} <Text style={styles.userNameSubText}>님</Text>
              </Text>
              <Text style={styles.emailText}>{userInfo?.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonBox}>
            <LargeButton
              text="로그아웃"
              backgroundColor={theme.colors.primary[300]}
              fontColor={theme.colors.gray[0]}
              typography={theme.typography.subtitle1}
              onPress={handleLogout}
            />
          </View>
          <View style={styles.buttonBox}>
            <LargeButton
              text="회원탈퇴"
              backgroundColor={theme.colors.gray[100]}
              fontColor={theme.colors.gray[400]}
              typography={theme.typography.subtitle1}
              onPress={handleWithdraw}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[0],
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  infoAndImageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(8),
    alignSelf: 'stretch',
  },
  imageContainer: {
    width: wp(300),
    height: hp(300),
    padding: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    height: hp(150),
    paddingHorizontal: wp(24),
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(32),
    alignSelf: 'stretch',
  },
  infoBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(12),
    alignSelf: 'stretch',
  },
  userNameText: {
    color: theme.colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(36),
    fontWeight: '600',
    lineHeight: px(34),
  } as TextStyle,
  userNameSubText: {
    color: theme.colors.gray[950],
    fontFamily: 'Pretendard-Semibold',
    fontSize: px(36),
    fontWeight: '600',
    lineHeight: px(34),
  } as TextStyle,
  emailText: {
    color: theme.colors.gray[500],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(24),
    fontWeight: '500',
    lineHeight: px(28),
  } as TextStyle,
  buttonContainer: {
    paddingVertical: hp(40),
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(16),
    alignSelf: 'stretch',
  },
  buttonBox: {
    paddingHorizontal: wp(24),
    alignSelf: 'stretch',
  },
});
