import { useDependency } from '@/src/ioc';
import { Service } from '../service';

export const useService = () => {
  const service = useDependency(Service);
  const getTaskCount = service.getTaskCount;
  const getTodoList = service.getTodoList;
  const getDoneList = service.getDoneList;
  const getMyApplyList = service.getMyApplyList;
  const getTasks = service.getTasks;
  const getPlatformUsers = service.getPlatformUsers;
  const getTaskCollectionCount = service.getTaskCollectionCount;

  return { getTodoList, getTaskCount, getDoneList, getMyApplyList, getTasks, getPlatformUsers, getTaskCollectionCount };
};
