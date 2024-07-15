import { useDependency } from '@/src/ioc';
import { Service } from '../service';
import { useCallback, useEffect, useState } from 'react';
import { useLoader } from '@/src/hooks';

export const useService = () => {
  const service = useDependency(Service);
  const getCollectionsTaskDetail = service.getCollectionsTaskDetail;
  const getPlatformUserList = service.getPlatformUserList;
  const dispatchCollectionsTask = service.dispatchCollectionsTask;
  const signInCollectionsTask = service.signInCollectionsTask;

  return { getCollectionsTaskDetail, getPlatformUserList, dispatchCollectionsTask, signInCollectionsTask };
};

export const usePlatformUserList = () => {
  const { getPlatformUserList } = useService();
  const [userList, setUserList] = useState<{ userId: number; userName: string }[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState('');

  const loadMoreData = useCallback(async () => {
    if (!hasMore) {
      return;
    }
    setLoading(true);
    const { result = [], total = 0 } = await getPlatformUserList({
      pageNum: pageNum,
      pageSize: 15,
      nickname: keyword,
    });
    setLoading(false);
    setHasMore(pageNum * 5 < total);
    setUserList((prevData) => [...prevData, ...result]);
    setLoading(false);
  }, [getPlatformUserList, hasMore, keyword, pageNum]);

  useEffect(() => {
    loadMoreData();
  }, [loadMoreData]);

  const loadMore = () => {
    if (hasMore) {
      setPageNum((prevPage) => prevPage + 1);
    }
  };

  const onSearch = (value: string) => {
    setUserList([]);
    setKeyword(value);
    setPageNum(1);
    setHasMore(true);
  };

  return { userList, loading, loadMore, onSearch, hasMore };
};

export const useDispatchCollectionsTask = () => {
  const { setVisible } = useLoader();
  const { dispatchCollectionsTask } = useService();

  const run = useCallback(
    async (params: { taskId: number; userId: number; userName: string }) => {
      setVisible(true);
      await dispatchCollectionsTask(params);
      setVisible(false);
    },
    [dispatchCollectionsTask, setVisible],
  );

  return {
    run,
  };
};
