import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [access_lvl, setAccessLvl] = useState(null);
  const [access_name, setAccessName] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback(
    (
      jwtAccessToken: any,
      jwtRefreshToken: any,
      id: any,
      mode: any,
      email_value: any,
      access_value: any
    ) => {
      setAccessToken(jwtAccessToken);
      setRefreshToken(jwtRefreshToken);
      setUser_id(id);
      setAccessLvl(mode);
      setEmail(email_value);
      setAccessName(access_value);

      localStorage.setItem(
        storageName,
        JSON.stringify({
          user_id: id,
          access_token: jwtAccessToken,
          refresh_token: jwtRefreshToken,
          email: email_value,
          access_name: access_value,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser_id(null);
    setEmail(null);
    setAccessName(null);

    localStorage.removeItem(storageName);
  }, []);

  // Обновляем токен доступа
  const updateToken = useCallback((token: any) => {
    setAccessToken(token);

    const data = JSON.parse(localStorage.getItem(storageName) || '{}');
    data.access_token = token;

    localStorage.setItem(storageName, JSON.stringify(data));
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName) || '{}');

    if (data && data.access_token) {
      login(
        data.access_token,
        data.refresh_token,
        data.user_id,
        data.access_lvl,
        data.email,
        data.access_name
      );
    }

    setReady(true);
  }, [login]);

  return {
    login,
    logout,
    updateToken,
    accessToken,
    refreshToken,
    email,
    user_id,
    access_lvl,
    access_name,
    ready,
  };
};

export default useAuth;
