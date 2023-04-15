import { useEffect, useRef, useContext, useState } from 'react';
import '../context.scss';

import { motion, AnimatePresence } from 'framer-motion';

import ChangeUserForm from '../../../utils/changeUser';

// Include hooks
import useHttp from '../../../hooks/http.hook';

// Config
import config from '../../../config/main.json';

import { AuthContext } from '../../../context/authContext';

const EditUser = (props: any) => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();

  const { activeUser, isOpen } = props;

  const [isOpenForm, setIsOpenForm] = useState(false);

  const styles = {
    top: props.height + 20,
  };

  // Close context menu, when onclick outside START
  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.isEdit(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  const modalRef = useRef(null);
  useOutsideAlerter(modalRef);
  // Close context menu, when onclick outside END

  // Remove event
  const removeObject = () => {
    const fetchData = async () => {
      console.log(auth.accessToken);
      try {
        const url = `${config.URL}/api/removeUser/${activeUser.id}`;
        await request(url, 'DELETE', null);

        // Активируем статус "Удалено", чтобы в компоненте objectsBlock выполнить перерисовку объектов
        props.isRemove(true);

        // Закрываем контекстное меню
        props.isEdit(false);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  };

  // Click change user
  const changeUserHandler = () => {
    isOpen(true);
    props.isEdit(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='context-menu edit-block'
        style={styles}
        ref={modalRef}
      >
        <span
          className='edit-block__item edit-block__change'
          onClick={() => changeUserHandler()}
        >
          Редактировать
        </span>
        <span
          className='edit-block__item edit-block__remove'
          onClick={() => removeObject()}
        >
          Удалить
        </span>
      </motion.div>
      {isOpenForm && (
        <ChangeUserForm isOpen={setIsOpenForm} activeUser={activeUser} />
      )}
    </AnimatePresence>
  );
};

export default EditUser;
