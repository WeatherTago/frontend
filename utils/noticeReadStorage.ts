import AsyncStorage from '@react-native-async-storage/async-storage';
const READ_NOTICE_KEY = 'READ_NOTICE_IDS';

export const markNoticeAsRead = async (id: number) => {
  const raw = await AsyncStorage.getItem(READ_NOTICE_KEY);
  const ids = raw ? JSON.parse(raw) : [];
  if (!ids.includes(id)) {
    ids.push(id);
    await AsyncStorage.setItem(READ_NOTICE_KEY, JSON.stringify(ids));
  }
};

export const getReadNoticeIds = async (): Promise<number[]> => {
  const raw = await AsyncStorage.getItem(READ_NOTICE_KEY);
  return raw ? JSON.parse(raw) : [];
};
