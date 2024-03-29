import React, { useState, useEffect, useRef, useContext } from 'react';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faSquarePlus,
  faSquareMinus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import useHttp from '../../../../../hooks/http.hook';
import config from '../../../../../config/main.json';
import { IPiezometersProps } from '../../../../../config/types';

import { AuthContext } from '../../../../../context/authContext';
import EditPiezo from '../../../../../utils/contextMenu/EditPiezo';
import MessageBox from '../../../../../utils/modals/messageBox';

const activeClass = 'table-item__active';
const divVariants: Variants = {
  open: {
    y: 0,
    display: 'flex',
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    display: 'none',
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const PiezometersBlock = (props: any) => {
  const auth = useContext(AuthContext);

  const [piezometers, setPiezometers] = useState<IPiezometersProps[]>([]);
  const { request } = useHttp();

  // Деструктуризация пропсов
  const { activeObject, updateActivePiezometer } = props;

  const [activePiezo, setActivePiezo] = useState<IPiezometersProps>();

  // Состояния для добавления скважины
  const [namepiezo, setNamePiezo] = useState('');
  const [isHide, setIsHide] = useState(true);
  const [isDisplay, setIsDisplay] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const [posYObject, setPosYObject] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [message, setMessage] = useState('');

  // Skip first render with useRef
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    //if (auth.access_name !== 'Администратор') {
    // const fetchData = async () => {
    //   try {
    //     const url = `${config.URL}/api/getPiezometers/${activeObject.id}`;
    //     const data = await request(url, 'GET');

    //     setPiezometers(data);
    //     console.log(data);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };

    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/getPiezometersForClients`;
        const data = await request(url, 'POST', {
          access_name: auth.access_name,
          object_id: activeObject.id,
          user_id: auth.user_id,
        });

        setPiezometers(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
    //}
    // else {
    //   const fetchData = async () => {
    //     try {
    //       const url = `${config.URL}/api/getPiezometersForClients`;
    //       const data = await request(url, 'POST', {
    //         access_name: auth.access_name,
    //         object_id: activeObject.id,
    //         user_id: auth.user_id,
    //       });

    //       setPiezometers(data);
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   };

    //   fetchData();
    // }
  }, [request, activeObject, isAdd, isRemove, auth.access_name, auth.user_id]);

  const selectActivePiezometer = (e: any, id: number) => {
    const filter = piezometers.filter((item) => item.id === id);
    updateActivePiezometer(filter[0]);
    setActivePiezo(filter[0]);

    // Получаем высоту выбранного объекта
    let getHeight = e.clientY;
    setPosYObject(getHeight);
  };

  // Событие поля piezoname
  const changePiezoInput = (e: any) => {
    let value = e.target.value;
    setIsHide(value === '' ? true : false);
    setNamePiezo(value);
  };

  // Событие иконки "Добавить пьезометр"
  const addPiezoToggle = () => {
    setToggle(toggle ? false : true);
    setIsDisplay(isDisplay ? false : true);
  };

  // Событие иконки "Добавить пьезометр"
  const createPiezoHandler = () => {
    const fetchCreatePiezo = async () => {
      try {
        const url = `${config.URL}/api/createPiezometer/`;
        const body = {
          name: namepiezo,
          object_id: activeObject.id,
          user_id: auth.user_id,
        };

        await request(url, 'POST', body);

        setIsAdd(true);
        setToggle(false);
        setIsDisplay(false);
        setNamePiezo('');
      } catch (e: any) {
        props.isAddedPiezo(true);
        props.isAddedPiezoMsg(e.message);
      }
    };

    fetchCreatePiezo();
  };

  // Закрываем модалку через 3 секунды
  useEffect(() => {
    if (isRemove) {
      setMessage(`Скважина <${activePiezo!.name}> успешно удалена.`);
      const timer = setTimeout(() => {
        setIsRemove(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRemove, activePiezo]);

  return (
    <AnimatePresence>
      <div className='table-block piezometers-block'>
        <div className='table-caption'>
          <span>Пьезометр</span>
          {activeObject.length !== 0 && auth.access_name !== 'Гость' && (
            <FontAwesomeIcon
              icon={toggle ? faSquareMinus : faSquarePlus}
              className='plus-icon'
              title='Добавить скважину'
              onClick={() => addPiezoToggle()}
            />
          )}
        </div>
        <motion.div
          className='table-input-piezo'
          variants={divVariants}
          animate={isDisplay ? 'open' : 'closed'}
        >
          <input
            type='text'
            name='piezoname'
            value={namepiezo}
            placeholder='Скважина...'
            onChange={(e) => changePiezoInput(e)}
          />
          <FontAwesomeIcon
            icon={faCheck}
            className={`check-icon ${isHide && 'hide'}`}
            onClick={() => createPiezoHandler()}
          />
        </motion.div>
        <motion.div
          className='table-items'
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {piezometers.length ? (
            piezometers.map((item) => (
              <div
                key={item.id}
                className={`table-item ${activePiezo === item && activeClass}`}
                onClick={(e) => selectActivePiezometer(e, item.id)}
              >
                <span className='table-item__text'>{item.name}</span>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className='dots-vertical-icon'
                  title='Параметры'
                  onClick={() => setIsEdit(true)}
                />
              </div>
            ))
          ) : (
            <div>
              {activeObject.id !== undefined ? (
                <span className='table-item__text'>Нет</span>
              ) : (
                <span className='table-item__text'>Не выбран объект</span>
              )}
            </div>
          )}
          {isEdit && (
            <EditPiezo
              height={posYObject}
              isEdit={setIsEdit}
              isRemove={setIsRemove}
              activePiezo={activePiezo}
            />
          )}
          {isRemove && <MessageBox message={message} />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PiezometersBlock;
