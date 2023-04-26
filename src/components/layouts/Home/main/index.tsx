import React, { useState, useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { IObjectsProps, IPiezometersProps } from '../../../../config/types';

// Components
import ObjectsBlock from './objectsBlock';
import PiezometersBlock from './piezoBlock';
import DataBlock from './dataBlock';

const Main = (props: any) => {
  const [activeObject, setActiveObject] = useState<IObjectsProps[]>([]);
  const [activePiezo, setActivePiezo] = useState<IPiezometersProps[]>([]);

  // Отлавливаем активный объект (через useCallBack заходим только при изменении значения)
  const updateActiveObject = useCallback((value: Array<IObjectsProps>) => {
    setActiveObject(value);
  }, []);

  // Отлавливаем активный пьезометр (через useCallBack заходим только при изменении значения)
  const updateActivePiezometer = useCallback(
    (value: Array<IPiezometersProps>) => {
      setActivePiezo(value);
    },
    []
  );

  return (
    <main className='home-block__content-section'>
      <div className='home-block__content-section__left'>
        <ObjectsBlock updateActiveObject={updateActiveObject} />
        <FontAwesomeIcon icon={faArrowRight} className='arrow-right-icon' />
        <PiezometersBlock
          activeObject={activeObject}
          updateActivePiezometer={updateActivePiezometer}
          isAddedPiezo={props.isAddedPiezo}
          isAddedPiezoMsg={props.isAddedPiezoMsg}
        />
        <FontAwesomeIcon icon={faArrowRight} className='arrow-right-icon' />
      </div>
      <DataBlock
        activePiezo={activePiezo}
        getSensorIdModal={props.getSensorIdModal}
        isSuccessAddData={props.isSuccessAddData}
      />
    </main>
  );
};

export default Main;
