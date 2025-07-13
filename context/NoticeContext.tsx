import { fetchNotices, Notice } from '@/apis/notice';
import { getReadNoticeMap } from '@/utils/noticeReadStorage';
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';

interface NoticeContextType {
  notices: Notice[];
  readIds: number[]; // optional compatibility
  isNewUnreadExists: boolean;
  refetchNotices: () => void;
}

const NoticeContext = createContext<NoticeContextType | null>(null);

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readMap, setReadMap] = useState<Record<number, boolean>>({});

  const loadNotices = async () => {
    const data = await fetchNotices();
    const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotices(sorted);
  };

  const loadReadMap = async () => {
    const map = await getReadNoticeMap();
    setReadMap(map);
  };

  const refetchNotices = async () => {
    await Promise.all([loadNotices(), loadReadMap()]);
  };

  useEffect(() => {
    refetchNotices();
  }, []);

  const isNewUnreadExists = notices.some((n) =>
    dayjs().diff(dayjs(n.createdAt), 'day') <= 2 && !readMap[n.noticeId]
  );

  return (
    <NoticeContext.Provider
      value={{
        notices,
        readIds: Object.keys(readMap).map((id) => Number(id)), // compatibility only
        isNewUnreadExists,
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
