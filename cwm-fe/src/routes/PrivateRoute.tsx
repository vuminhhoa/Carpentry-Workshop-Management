import React from 'react';
import { Navigate } from 'react-router-dom';
import LayoutSystem from 'containers/Layout';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';
import NotFoundPage from 'containers/NotFoundPage';

interface PrivateProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateProps) => {
  const isLoggin: boolean = Boolean(localStorage.getItem(ACCESS_TOKEN));

  return isLoggin ? (
    <>
        <LayoutSystem>{children}</LayoutSystem>
    </>
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
