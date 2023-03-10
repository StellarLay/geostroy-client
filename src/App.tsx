import React, { useState, useCallback, useEffect } from 'react';
import './App.scss';

import Home from './components/layouts/Home';
import SideBar from './components/layouts/sidebar';
import AddDataModal from './utils/addData';

import './media.scss';

import { IDataAddModal } from './config/types';
import MessageBox from './utils/modals/messageBox';

function App() {
  const [dataAddModal, setDataAddModal] = useState<IDataAddModal[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isSuccessAddData, setIsSuccessAddData] = useState(false);
  const [messageBoxText, setMessageBoxText] = useState('');
  const [isOpenMessageBox, setIsOpenMessageBox] = useState(false);

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

      // Закрываем модалку через 3 секунды
      const timer = setTimeout(() => {
        setIsSuccessAddData(false);
        setIsOpenMessageBox(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessAddData]);

  return (
    <div className='app'>
      <div className='sidebar-container'>
        <SideBar />
      </div>
      <Home
        getSensorIdModal={getSensorIdModal}
        isSuccessAddData={isSuccessAddData}
      />
      {isOpenAddModal && (
        <AddDataModal
          dataAddModal={dataAddModal}
          isOpen={setIsOpenAddModal}
          isSuccess={setIsSuccessAddData}
        />
      )}
      {isOpenMessageBox && <MessageBox message={messageBoxText} />}
    </div>
  );
}

export default App;
