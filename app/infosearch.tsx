import ArrowIcon from '@/components/Icons/ArrowIcon';
import { useStationContext } from '@/context/StationContext';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const {stations}=useStationContext();
  const inputRef = useRef<TextInput>(null);

// 중복 없는 역 이름 배열 만들기
  const uniqueStationNames = useMemo(() => {
  const nameSet = new Set<string>();
  stations.forEach(s => nameSet.add(s.stationName));
  return Array.from(nameSet);
}, [stations]);
  // Fuse.js로 필터링
  const fuse = useMemo(() => new Fuse(uniqueStationNames, { threshold: 0.5 }), [uniqueStationNames]);

const filteredStations = searchText
  ? fuse.search(searchText).map(res => res.item)
  : [];

  const handleSelect = (name: string) => {
  const trimmedName = name.trim();
  const isValid = stations.some(s => s.stationName === trimmedName);

  if (!isValid) {
    Alert.alert('역 정보 없음', `'${trimmedName}' 역은 존재하지 않습니다.`);
    return;
  }

  setSearchText(trimmedName);
  Keyboard.dismiss();

  const selected = stations.find(s => s.stationName === trimmedName);
  const line = selected?.stationLine || '';

  router.push({
    pathname: '../infosearch-result',
    params: { station: trimmedName, line: `${line}` },
  });
};


const screenHeight = Dimensions.get('window').height;
const listHeight = screenHeight * 0.5; // 화면의 절반 높이

 useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [isEmptySearch, setIsEmptySearch] = useState(false);

 return (
    <View style={{ flex:1, paddingTop: insets.top, backgroundColor: '#FFF' }}>
      {/* 상단 검색바 */}
      <View style={[styles.container, {backgroundColor:theme.colors.gray[0]}]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowIcon
            direction="left"
            color={theme.colors.gray[500]} 
            width={px(46)}
            height={px(46)}
          />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.colors.gray[950] }]}
          placeholder="편의시설이 궁금한 역을 검색해보세요"
          placeholderTextColor={theme.colors.gray[300]}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={() => {
            const trimmed = searchText.trim();

            if (!trimmed) {
              setIsEmptySearch(true);  // ✅ 빈 입력시 이미지 띄우기 활성화
              return;
            }

            setIsEmptySearch(false); // ✅ 정상 검색 시 이미지 숨김

            const isValid = stations.some(s => s.stationName === trimmed);
            if (!isValid) {
              Alert.alert(
                '역 정보 없음',
                `'${trimmed}' 역은 존재하지 않습니다.`,
                [
                  {
                    text: '확인',
                    onPress: () => inputRef.current?.focus(),
                  },
                ]
              );
              return;
            }

            const selected = stations.find(s => s.stationName === trimmed);
            const line = selected?.stationLine || '';
            router.push({
              pathname: '../infosearch-result',
              params: { station: trimmed, line: `${line}` },
            });
          }}


        />
      </View>

{
  isEmptySearch ? (
    <View style={{ flex: 1, justifyContent: 'flex-start',paddingTop: hp(200), alignItems: 'center' }}>
      <Image
        source={require('@/assets/images/empty/subway-question-main.png')}
        style={{width: wp(300), height: hp(200), resizeMode: 'contain' }}
      />
      <Text style={{ color: theme.colors.gray[300],fontSize:px(20),fontFamily:'Pretendard-SemiBold',fontWeight:'600'}}>
        역 정보를 찾을 수 없어요
      </Text>
    </View>
  ) : filteredStations.length > 0 ? (
    <FlatList
      data={filteredStations}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelect(item)} style={{ padding: px(24) }}>
          <Text style={[styles.suggestionItemText, { color: theme.colors.gray[900] }]}>{item}</Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: theme.colors.gray[100] }} />
      )}
      style={{ backgroundColor: '#FFF', maxHeight: listHeight }}
      keyboardShouldPersistTaps="handled"
    />
  ) : null
}
  </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    width: wp(540),
    height: hp(90),
    paddingHorizontal: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
    flexShrink: 0,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: px(24),
    fontFamily:'Pretendard-Medium',
    fontWeight:500,
  },
  suggestionItemText:{
    fontSize:px(22),
    fontFamily:'Pretendard-Regular',
    fontWeight:400,
    lineHeight:px(34)
  }
});
