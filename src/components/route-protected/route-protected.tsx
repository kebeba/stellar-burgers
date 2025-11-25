import { useLocation, Navigate } from 'react-router-dom';

import { Preloader } from '../ui/preloader';

import { useSelector } from '../../services/store';
import {
  getLoadingStatus,
  getUserAuthStatus
} from '../../services/slices/auth-slice';

type RouteProtectedProps = {
  children: React.ReactElement;
  unAuthUserOnly?: boolean;
};

export const RouteProtected = ({
  children,
  unAuthUserOnly
}: RouteProtectedProps) => {
  const isAuthLoading = useSelector(getLoadingStatus);
  const isAuthorized = useSelector(getUserAuthStatus);
  const location = useLocation();

  if (isAuthLoading) {
    return <Preloader />;
  }

  if (!unAuthUserOnly && !isAuthorized) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (unAuthUserOnly && isAuthorized) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
