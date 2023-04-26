import React, { useState, useCallback, useEffect } from 'react';

import Home from '../../../components/layouts/Home';
import SideBar from '../../../components/layouts/sidebar';
import AddDataModal from '../../../utils/addData';

import { IDataAddModal } from '../../../config/types';
import MessageBox from '../../../utils/modals/messageBox';

function App() {
  const [dataAddModal, setDataAddModal] = useState<IDataAddModal[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isSuccessAddData, setIsSuccessAddData] = useState(false);
  const [messageBoxText, setMessageBoxText] = useState('');
  const [isOpenMessageBox, setIsOpenMessageBox] = useState(false);

  const [isAddedPiezo, setIsAddedPiezo] = useState(false);

  // Прокидываем пропсы для модального окна "Добавить показание" полей (sensor_id и piezo_id)
  const getSensorIdModal = useCallback(
    (value: IDataAddModal[], isOpen: boolean) => {
      setDataAddModal(value);
      setIsOpenAddModal(isOpen);
    },
    []
  );

  // Отображаем MessageBox (top right) при определенных условиях
  useEffect(() => {
    if (isSuccessAddData) {
      setMessageBoxText('Показание успешно добавлено');
      setIsOpenMessageBox(true);
    }

    // Закрываем модалку через 3 секунды
    const timer = setTimeout(() => {
      setIsSuccessAddData(false);
      setIsOpenMessageBox(false);
      setIsAddedPiezo(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isSuccessAddData, isAddedPiezo]);

  return (
    <div className='app-main'>
      <SideBar />
      <Home
        getSensorIdModal={getSensorIdModal}
        isSuccessAddData={isSuccessAddData}
        isAddedPiezo={setIsAddedPiezo}
        isAddedPiezoMsg={setMessageBoxText}
      />
      {isOpenAddModal && (
        <AddDataModal
          dataAddModal={dataAddModal}
          isOpen={setIsOpenAddModal}
          isSuccess={setIsSuccessAddData}
        />
      )}
      {(isOpenMessageBox || isAddedPiezo) && (
        <MessageBox message={messageBoxText} color={isAddedPiezo && 'error'} />
      )}
    </div>
  );
}

export default App;
