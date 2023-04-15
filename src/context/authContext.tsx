import { createContext } from 'react';

interface IAuthContext {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  user_id: number | null;
  login: (
    jwtAccessToken: any,
    jwtRefreshToken: any,
    id: any,
    mode: any,
    email_value: any,
    access_name: any
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
  access_lvl: number | null;
  access_name: string | null;
}

function noop() {}

export const AuthContext = createContext<IAuthContext>({
  accessToken: null,
  refreshToken: null,
  email: null,
  user_id: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  access_lvl: null,
  access_name: null,
});
