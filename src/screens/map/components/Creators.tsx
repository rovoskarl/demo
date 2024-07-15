import { Text, XStack, View } from 'tamagui';
import { useCreateUserList } from '../hooks';
import { TCreateUserList } from '@/src/interfaces/map';
import { TouchableOpacity } from 'react-native';

function truncateString(str: string, maxLength = 5) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  } else {
    return str;
  }
}

export const Creators = ({ creators = [], type, setSearchData }: any) => {
  const { createUserList, createUserShopList } = useCreateUserList({ isPageable: false, type });
  // const { createUserList, createUserShopList } = useSearchInfo();
  const creatorIds = creators?.map((item: any) => item.createUserId);

  return (
    <View paddingHorizontal={4}>
      <XStack flexWrap="wrap" maxHeight={81} overflow="hidden">
        {(type === 'position' ? createUserList : createUserShopList)?.map((item: TCreateUserList, index: number) => {
          const checked = creatorIds?.includes(item.createUserId);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (checked) {
                  if (type === 'position') {
                    setSearchData((_prev: any) => ({
                      ..._prev,
                      position: {
                        ..._prev?.position,
                        creators: _prev?.position?.creators?.filter(
                          ({ createUserId }: any) => createUserId !== item?.createUserId,
                        ),
                      },
                    }));
                  }
                  if (type === 'shop') {
                    setSearchData((_prev: any) => ({
                      ..._prev,
                      shopPositionRequest: {
                        ..._prev?.shopPositionRequest,
                        creators: _prev?.shopPositionRequest?.creators?.filter(
                          ({ createUserId }: any) => createUserId !== item?.createUserId,
                        ),
                      },
                    }));
                  }
                } else {
                  if (type === 'position') {
                    setSearchData((_prev: any) => ({
                      ..._prev,
                      position: {
                        ..._prev?.position,
                        creators: [...creators, item],
                      },
                    }));
                  }
                  if (type === 'shop') {
                    setSearchData((_prev: any) => ({
                      ..._prev,
                      shopPositionRequest: {
                        ..._prev?.shopPositionRequest,
                        creators: [...creators, item],
                      },
                    }));
                  }
                }
              }}
            >
              <View
                height={36}
                paddingHorizontal={10}
                marginBottom={8}
                backgroundColor={checked ? '$primary1Light' : '#FAFAFA'}
                borderColor={checked ? '$primaryLight' : '#FFFFFF'}
                borderWidth={1}
                borderRadius={8}
                marginRight={8}
              >
                <Text textAlign="center" lineHeight={36} color={checked ? '$primaryLight' : '#141414'} fontSize={12}>
                  {truncateString(item.createUserName)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
};
