import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import Loader from './components/loader';

import './App.scss';

import { useRoutes } from './routes';
import { AuthContext } from './context/authContext';

import useAuth from './hooks/auth.hook';

function App() {
  // Получаем контекст значения из хука auth.hook
  const {
    accessToken,
    refreshToken,
    email,
    user_id,
    login,
    logout,
    access_lvl,
    access_name,
    ready,
  } = useAuth();
  const isAuthenticated = !!accessToken;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        email,
        user_id,
        login,
        logout,
        isAuthenticated,
        access_lvl,
        access_name,
      }}
    >
      <Router>
        <div className='app'>{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
