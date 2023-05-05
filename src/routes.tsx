import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/layouts/Main/';
import Auth from './components/auth';
import ResetPass from './components/auth/reset';

import './media.scss';
import UsersPage from './pages/Users';
import SettingsPage from './pages/Settings';

export const useRoutes = (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route
          path='/auth'
          element={isAuthenticated ? <Navigate to='/' replace /> : <Auth />}
        />
        <Route
          path='/users'
          element={isAuthenticated ? <UsersPage /> : <Auth />}
        />
        <Route
          path='/settings'
          element={isAuthenticated ? <SettingsPage /> : <Auth />}
        />
        <Route path='/' element={<Main />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path='/'
        element={!isAuthenticated ? <Navigate to='/auth' replace /> : <Main />}
      />
      <Route
        path='/auth'
        element={isAuthenticated ? <Navigate to='/' replace /> : <Auth />}
      />
      <Route
        path='/reset'
        element={isAuthenticated ? <Navigate to='/' replace /> : <ResetPass />}
      />
      <Route
        path='/users'
        element={isAuthenticated ? <UsersPage /> : <Auth />}
      />
      <Route
        path='/settings'
        element={isAuthenticated ? <SettingsPage /> : <Auth />}
      />
    </Routes>
  );
};
