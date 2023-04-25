import React, { useState, useEffect, useContext } from 'react';

// Include components
import MessageBox from '../../../../../utils/modals/messageBox';
import Edit from '../../../../../utils/contextMenu/Edit';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

// Include hooks
import useHttp from '../../../../../hooks/http.hook';
import useCreateToken from '../../../../../hooks/createToken.hook';

// Config
import config from '../../../../../config/main.json';
import { IObjectsProps } from '../../../../../config/types';

import { AuthContext } from '../../../../../context/authContext';

const activeClass = 'table-item__active';

const ObjectsBlock = (props: any) => {
  const auth = useContext(AuthContext);

  // Деструктуризация пропсов
  const { updateActiveObject } = props;

  const [objects, setObjects] = useState<IObjectsProps[]>([]);
  const [activeObject, setActiveObject] = useState<IObjectsProps>();

  const [posYObject, setPosYObject] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [message, setMessage] = useState('');

  const { request } = useHttp();
  const { createToken } = useCreateToken();

  // Загружаем объекты
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorization = {
          Authorization: `Bearer ${auth.accessToken}`,
        };
        const url = `${config.URL}/api/getObjects`;
        const data = await request(
          url,
          'POST',
          { user_id: auth.user_id, access_name: auth.access_name },
          authorization
        );

        setObjects(data.results);

        // Если токен просрочен, создаем новый токен
        if (data.status && data.status === 403) {
          createToken();
        }
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, [
    request,
    createToken,
    updateActiveObject,
    auth.accessToken,
    auth.refreshToken,
    auth.user_id,
    auth.access_name,
    isRemove,
  ]);

  const selectActiveObject = (e: any, id: number) => {
    const filter = objects.filter((item) => item.id === id);
    setActiveObject(filter[0]);
    updateActiveObject(filter[0]);

    // Получаем высоту выбранного объекта
    let getHeight = e.clientY;
    setPosYObject(getHeight);
  };

  // Закрываем модалку через 3 секунды
  useEffect(() => {
    if (isRemove) {
      setMessage(`Объект <${activeObject!.name}> успешно удалён.`);
      const timer = setTimeout(() => {
        setIsRemove(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRemove, activeObject]);

  return (
    <div className='table-block objects-block'>
      <div className='table-caption'>
        <span>Объект</span>
      </div>
      <div className='table-items'>
        {objects.length !== 0 ? (
          objects.map((item) => (
            <div
              key={item.id}
              className={`table-item ${activeObject === item && activeClass}`}
              onClick={(e) => selectActiveObject(e, item.id)}
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
          <div>Нет</div>
        )}
        {isEdit && (
          <Edit
            height={posYObject}
            isEdit={setIsEdit}
            isRemove={setIsRemove}
            activeObject={activeObject}
          />
        )}
        {isRemove && <MessageBox message={message} />}
      </div>
    </div>
  );
};

export default ObjectsBlock;
