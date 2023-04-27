import { useEffect, useRef, useContext } from 'react';
import '../context.scss';

import { motion, AnimatePresence } from 'framer-motion';

// Include hooks
import useHttp from '../../../hooks/http.hook';

// Config
import config from '../../../config/main.json';

import { AuthContext } from '../../../context/authContext';

const Edit = (props: any) => {
  const auth = useContext(AuthContext);

  const { request } = useHttp();

  const styles = {
    top: props.height - 60,
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
        const url = `${config.URL}/api/removeObject/${props.activeObject.id}`;
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
        <span className='edit-block__item edit-block__change locked'>
          Редактировать (скоро)
        </span>
        <span
          className='edit-block__item edit-block__remove'
          onClick={() => removeObject()}
        >
          Удалить
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Edit;
