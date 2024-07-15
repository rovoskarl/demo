import { Right } from '@/src/icons';
import { ReactNode, createContext, useContext } from 'react';
import classNames from 'classnames';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface BreadcrumbContextProps {
  isActive?: boolean;
  iconAfter?: boolean;
}

const BreadCrumbContext = createContext<BreadcrumbContextProps>({});

const Item = ({ children, onPress }: { children: string | ReactNode; onPress?: (() => void) | undefined }) => {
  const { isActive: isActiveFromContext, iconAfter: iconAfterFromContext } = useContext(BreadCrumbContext);
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center justify-center">
        {typeof children === 'string' ? (
          <Text
            className={classNames('text-base font-normal', {
              'text-primary': !isActiveFromContext,
              'text-gray-500': isActiveFromContext,
            })}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {iconAfterFromContext && (
          <View className="w-4 h-4 items-center justify-center mr-[6]">
            <Right width={16} height={12} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

type Props = {
  children: React.ReactNode[];
  className?: string;
};

const Breadcrumb: React.FC<Props> & { Item: typeof Item } = ({ children, className }) => {
  const cls = `flex-row p-4 bg-bgColor-light`;

  return (
    <View className={classNames(cls, className)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {children.map((item, index) => {
          return (
            <BreadCrumbContext.Provider
              key={index}
              value={{
                isActive: index === children.length - 1,
                iconAfter: index !== children.length - 1,
              }}
            >
              {item}
            </BreadCrumbContext.Provider>
          );
        })}
      </ScrollView>
    </View>
  );
};

Breadcrumb.Item = Item;

export { Breadcrumb };
