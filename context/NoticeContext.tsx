import { fetchNotices, Notice } from '@/apis/notice';
import { getReadNoticeIds } from '@/utils/noticeReadStorage';
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';

interface NoticeContextType {
  notices: Notice[];
  readIds: number[];
  isNewUnreadExists: boolean;
  refetchNotices: () => void;
}

const NoticeContext = createContext<NoticeContextType | null>(null);

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);

  const loadNotices = async () => {
    const data = await fetchNotices();
    const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotices(sorted);
  };

  const loadReadIds = async () => {
    const ids = await getReadNoticeIds();
    setReadIds(ids);
  };

  const refetchNotices = () => {
    loadNotices();
    loadReadIds();
  };

  useEffect(() => {
    refetchNotices();
  }, []);

  const isNewUnreadExists = notices.some((n) => {
    const isNew = dayjs().diff(dayjs(n.createdAt), 'day') <= 2;
    const isRead = readIds.includes(n.noticeId);
    return isNew && !isRead;
  });

  return (
    <NoticeContext.Provider value={{ notices, readIds, isNewUnreadExists, refetchNotices }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNoticeContext = () => {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNoticeContext must be used within NoticeProvider');
  return ctx;
};
