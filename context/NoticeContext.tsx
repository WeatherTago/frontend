import { fetchNotices, Notice } from '@/apis/notice';
import { useAuth } from '@/context/AuthContext';
import { getReadNoticeMap } from '@/utils/noticeReadStorage';
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';

interface NoticeContextType {
  notices: Notice[];
  readIds: number[]; // optional compatibility
  isNewUnreadExists: boolean;
  loading: boolean;
  refetchNotices: () => void;
}

const NoticeContext = createContext<NoticeContextType | null>(null);

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readMap, setReadMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user, isAuthReady } = useAuth();

const loadNotices = async () => {
  try {
    const data = await fetchNotices();
    const sorted = data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotices(sorted);
  } catch (err) {
    if (__DEV__) console.error('[❌ 공지 로딩 실패]', err);
  }
};


  const loadReadMap = async () => {
    const map = await getReadNoticeMap();
    setReadMap(map);
  };

  const refetchNotices = async () => {
    setLoading(true);
    await Promise.all([
    (async () => {
      await loadNotices();
    })(),
    (async () => {
      await loadReadMap();
    })()
  ]);
  setLoading(false);
};

useEffect(() => {
  if (isAuthReady && user) {
    refetchNotices();
  }
}, [isAuthReady, user]);

  const isNewUnreadExists = notices.some(
    (n) => dayjs().diff(dayjs(n.createdAt), 'day') <= 2 && !readMap[n.noticeId]
  );

  return (
    <NoticeContext.Provider
      value={{
        notices,
        readIds: Object.keys(readMap).map((id) => Number(id)), // compatibility only
        isNewUnreadExists,
        loading,
        refetchNotices,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNoticeContext = () => {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNoticeContext must be used within NoticeProvider');
  return ctx;
};
