import { readUser } from '@/apis/user';
import Header from '@/components/Header/CommonHeader';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { UserInfo } from '@/types/user';
import { hp, px, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
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
          const res = withdraw();
          console.log(res);
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
        onPress: () => {
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
      <ScrollView>
        <View style={{ backgroundColor: theme.colors.gray[100] }}>
          <View style={styles.contentContainer}>
            <View style={styles.userContainer}>
              <View style={styles.imgContainer}>
                <Image source={require('@/assets/images/user.png')} style={styles.img} />
              </View>
              <View style={styles.userInfoContainer}>
                <View style={styles.userNameContainer}>
                  <Text style={styles.userNameText}>
                    {userInfo?.nickname}
                    <Text style={styles.userNameSubText}>님</Text>
                  </Text>
                </View>
                <View style={styles.emailContainer}>
                  <Text style={styles.emailText}>{userInfo?.email}</Text>
                </View>
              </View>
            </View>
            <View style={styles.settingContainer}>
              <View style={styles.categoryContainer}>
                <View style={styles.categoryNameContainer}>
                  <View style={styles.categoryNameTextContainer}>
                    <Text style={styles.categoryNameText}>계정</Text>
                  </View>
                </View>
                <View style={styles.categoryItemContainer}>
                  <View style={styles.categoryItemBox}>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>아이디 변경</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>비밀번호 변경</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>이메일 변경</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.categoryContainer}>
                <View style={styles.categoryNameContainer}>
                  <View style={styles.categoryNameTextContainer}>
                    <Text style={styles.categoryNameText}>이용 안내</Text>
                  </View>
                </View>
                <View style={styles.categoryItemContainer}>
                  <View style={styles.categoryItemBox}>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>앱 버전</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>문의하기</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>공지사항</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>서비스 이용약관</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>개인정보 처리방침</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>오픈소스 라이선스</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.categoryContainer}>
                <View style={styles.categoryNameContainer}>
                  <View style={styles.categoryNameTextContainer}>
                    <Text style={styles.categoryNameText}>기타</Text>
                  </View>
                </View>
                <View style={styles.categoryItemContainer}>
                  <View style={styles.categoryItemBox}>
                    <View style={styles.categoryItemTextContainer}>
                      <Text style={styles.categoryItemText}>정보 동의 설정</Text>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <TouchableOpacity onPress={handleWithdraw}>
                        <Text style={styles.categoryItemText}>회원 탈퇴</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.categoryItemTextContainer}>
                      <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.categoryItemText}>로그아웃</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[0],
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: hp(6),
  },
  userContainer: {
    height: hp(422),
    paddingVertical: hp(40),
    paddingHorizontal: wp(24),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(24),
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
  imgContainer: {
    width: wp(140),
    height: hp(140),
    padding:px(40),
    justifyContent:'center',
    alignItems:'center',
    flexShrink: 0,
    borderRadius:px(99),
    backgroundColor:theme.colors.gray[50]
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: hp(6),
    alignSelf: 'stretch',
  },
  userNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  userNameText: {
    color: theme.colors.primary[700],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(34),
  } as TextStyle,
  userNameSubText: {
    color: theme.colors.gray[950],
    fontFamily: 'Pretendard-Regular',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(34),
  } as TextStyle,
  emailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  emailText: {
    color: theme.colors.gray[500],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(18),
    fontWeight: '500',
    lineHeight: px(26),
  } as TextStyle,
  settingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(2),
    alignSelf: 'stretch',
  },
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  categoryNameContainer: {
    height: hp(74),
    paddingVertical: hp(20),
    paddingHorizontal: wp(24),
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
  categoryNameTextContainer: {
    alignSelf: 'stretch',
  },
  categoryNameText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(26),
    fontWeight: '600',
    lineHeight: px(34),
  } as TextStyle,
  categoryItemContainer: {
    padding: px(24),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
  categoryItemBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: hp(28),
    alignSelf: 'stretch',
  },
  categoryItemTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  categoryItemText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(20),
    fontWeight: '500',
    lineHeight: px(28),
  } as TextStyle,
});
