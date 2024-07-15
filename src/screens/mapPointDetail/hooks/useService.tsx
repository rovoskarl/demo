import { useDependency } from '@/src/ioc';
import { Service } from '../service';
import { useEffect, useState } from 'react';
import { Text, View, XStack } from 'tamagui';
import { useMapInfo } from '../../map/hooks';
import { useUser } from '@/src/hooks';

export enum OperationStatusEnum {
  '待审核',
  '发起',
  '审核通过',
  '审核不通过',
  '撤回',
  '驳回',
}

export const useService = () => {
  const service = useDependency(Service);
  const getShopOperation = service.getShopOperation;
  const getBusinessConfigDetail = service.getBusinessConfigDetail;
  const getAuditHistory = service.getAuditHistory;
  const getPositionRecord = service.getPositionRecord;

  return { getShopOperation, getBusinessConfigDetail, getAuditHistory, getPositionRecord };
};

export const useAuditHistory = (processInstanceId: number) => {
  const { getAuditHistory } = useService();
  const [auditHistory, setAuditHistory] = useState<any>([]);

  useEffect(() => {
    if (processInstanceId) {
      getAuditHistory({ processInstanceId }).then((res: any) => {
        setAuditHistory(
          res?.map((item: any, index: number) => {
            const remarkJson = item?.remark ? JSON.parse(item.remark) : {};

            const Content = ({ content }: { content: string }) => {
              return (
                <View flex={1}>
                  <Text>{content}</Text>
                  {item.reason && (
                    <Text>
                      {item.operationStatus === OperationStatusEnum.审核通过 ? '审核说明' : '审核意见'}: {item.reason}
                    </Text>
                  )}
                  {item.description && <Text>审核说明: {item.description}</Text>}
                  {Object.keys(remarkJson).length > 0 && (
                    <View className="mt-2 p-2 rounded-lg" backgroundColor="rgba(245,63,63,0.05)">
                      {Object.keys(remarkJson).map((key) => {
                        return (
                          <Text key={key} color="#F53F3F">
                            {`${key}: ${remarkJson[key]}`}
                          </Text>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            };
            const ContentObj = {
              [OperationStatusEnum.待审核 as OperationStatusEnum]: <Text flex={1}>审核人: {item.auditUserName}</Text>,
              [OperationStatusEnum.发起 as OperationStatusEnum]: <Text flex={1}>提交人: {item.auditUserName}</Text>,
              [OperationStatusEnum.审核不通过]: <Content content={`审核人: ${item.auditUserName}`} />,
              [OperationStatusEnum.审核通过]: <Content content={`审核人: ${item.auditUserName}`} />,
              [OperationStatusEnum.撤回]: <Content content={`${item.auditUserName}撤回了${item.name}`} />,
              [OperationStatusEnum.驳回]: <Content content={`审核人: ${item.auditUserName}`} />,
            }[item.operationStatus];

            return {
              id: index,
              time: item?.createTime,
              render: () => (
                <XStack justifyContent="space-between" flex={1} className="w-full">
                  {ContentObj}

                  <Text fontWeight="bold" marginLeft={10}>
                    {['待审核', '提交', '审核通过', '审核不通过', '撤回', '驳回'][item?.operationStatus]}
                  </Text>
                </XStack>
              ),
            };
          }),
        );
      });
    }
  }, [getAuditHistory, processInstanceId]);

  return { auditHistory };
};

export const useOperationRecord = ({ type, id }: { type: 'shop' | 'position'; id: number }) => {
  const { getPositionRecord, getShopOperation } = useService();
  const [records, setRecords] = useState<any[]>([]);
  const { user } = useUser();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadMoreData = async () => {
      if (!hasMore) {
        return;
      }
      setLoading(true);
      const { result = [], total = 0 } =
        type === 'position'
          ? await getPositionRecord({ mapId, pageSize: 10, pageNum, positionId: id })
          : await getShopOperation({ pageSize: 10, pageNum, shopId: id });
      setLoading(false);
      setHasMore(pageNum * 5 < total);
      setRecords((prevData) => [...prevData, ...result]);
      setLoading(false);
    };

    if (mapId && user) {
      loadMoreData();
    }
  }, [getPositionRecord, getShopOperation, hasMore, id, mapId, pageNum, type, user]);

  const loadMore = () => {
    if (hasMore) {
      setPageNum((prevPage) => prevPage + 1);
    }
  };

  return { records, loading, loadMore, hasMore };
};
