import React, { useState } from 'react';
import { AvatarContent, SearchGroup, ExpandGroupPointList, GroupPointMask } from './components';

export const MapList = ({ onUpdate }: { onUpdate: () => void }) => {
  const [hideElement, setHideElement] = useState<boolean>(true);

  return (
    <>
      <GroupPointMask bottom={0} />
      <AvatarContent onUpdate={onUpdate} />
      {hideElement ? <SearchGroup onUpdate={onUpdate} top={'9%'} /> : null}
      <ExpandGroupPointList
        hideSearchGroup={(flag: any) => {
          setHideElement(flag);
        }}
      />
    </>
  );
};
