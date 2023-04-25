import { useCallback, useContext } from 'react';

// Include hooks
import useHttp from './http.hook';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

import config from '../config/main.json';

// Запрос на изменение токена
const useCreateToken = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { request } = useHttp();

  // Logout
  const logoutHandler = useCallback(() => {
    auth.logout();
    navigate('/');
  }, [auth, navigate]);

  const createToken = useCallback(async () => {
    try {
      const body = {
        refresh_token: auth.refreshToken,
        user_id: auth.user_id,
      };

      const url = `${config.URL}/auth/token`;
      const data = await request(url, 'POST', body);

      // Если refresh_token недействителен, то logout
      if (data.message === 'jwt expired') {
        logoutHandler();
      }

      // Иначе обновляем токен
      else {
        auth.updateToken(data.accessToken);
      }
    } catch (e: any) {
      console.log(e);
    }
  }, [logoutHandler, request, auth]);

  return { createToken };
};

export default useCreateToken;
