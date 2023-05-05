import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';

// Components
import Filter from './filter';
import ResultGrid from './resultGrid';

import useHttp from '../../../../../hooks/http.hook';
import config from '../../../../../config/main.json';
import { ISensorsProps } from '../../../../../config/types';

import { AuthContext } from '../../../../../context/authContext';

const DataBlock = (props: any) => {
  const auth = useContext(AuthContext);

  const [sensor, setSensor] = useState<ISensorsProps[]>([]);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [isUpdatedRow, setIsUpdatedRow] = useState(false);
  const [isRemovedRow, setIsRemovedRow] = useState(false);
  const [filterData, setFilterData] = useState({});

  const { request } = useHttp();

  // Деструктуризация пропсов
  const { activePiezo, getSensorIdModal, isSuccessAddData } = props;

  // При привязке датчика обновляем таблицу
  const updateData = useCallback((value: boolean) => {
    setIsUpdateData(value);
  }, []);

  // При активации фильтра получаем значения с компонента
  const updateFilter = (value: any) => {
    setFilterData(value);
  };

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const authorization = {
          Authorization: `Bearer ${auth.accessToken}`,
        };
        const url = `${config.URL}/api/getSensors/${activePiezo.piezometer_id}`;
        const data = await request(url, 'GET', null, authorization);

        setSensor(data);
      } catch (e) {
        console.log(e);
      }
    };

    setIsUpdatedRow(false);
    setIsRemovedRow(false);

    if (activePiezo.length !== 0) {
      fetchData();
    }
  }, [
    request,
    activePiezo,
    isUpdateData,
    isUpdatedRow,
    isRemovedRow,
    getSensorIdModal,
    isSuccessAddData,
    auth.accessToken,
  ]);

  return (
    <div className='data-block'>
      <Filter updateFilter={updateFilter} />
      {Object.keys(activePiezo).length !== 0 ? (
        <ResultGrid
          sensorData={sensor}
          activePiezo={activePiezo}
          updateData={updateData}
          isUpdatedRow={setIsUpdatedRow}
          isRemovedRow={setIsRemovedRow}
          getSensorIdModal={getSensorIdModal}
          filterData={filterData}
        />
      ) : (
        <div className='result-grid result-grid__disable'>
          <span>Датчик не выбран / не привязан</span>
        </div>
      )}
    </div>
  );
};

export default DataBlock;
