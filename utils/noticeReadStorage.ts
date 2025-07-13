import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_NOTICE_KEY = 'READ_NOTICE_MAP';

export const markNoticeAsRead = async (id: number) => {
  const raw = await AsyncStorage.getItem(READ_NOTICE_KEY);
  const readMap: Record<number, boolean> = raw ? JSON.parse(raw) : {};

  if (!readMap[id]) {
    readMap[id] = true;
    await AsyncStorage.setItem(READ_NOTICE_KEY, JSON.stringify(readMap));
  }
};

export const getReadNoticeMap = async (): Promise<Record<number, boolean>> => {
  const raw = await AsyncStorage.getItem(READ_NOTICE_KEY);
  return raw ? JSON.parse(raw) : {};
};
