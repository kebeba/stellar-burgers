import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  RouteProtected
} from '@components';

import { useDispatch } from '../../services/store';
import { requestIngredients } from '../../services/slices/assortment-slice';
import { checkUserAuth } from '../../services/slices/auth-slice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestIngredients());
  }, [dispatch]);
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const modalClose = () => {
    console.log('modal_close');
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <RouteProtected unAuthUserOnly>
              <Login />
            </RouteProtected>
          }
        />
        <Route
          path='/register'
          element={
            <RouteProtected unAuthUserOnly>
              <Register />
            </RouteProtected>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RouteProtected unAuthUserOnly>
              <ForgotPassword />
            </RouteProtected>
          }
        />
        <Route
          path='/reset-password'
          element={
            <RouteProtected unAuthUserOnly>
              <ResetPassword />
            </RouteProtected>
          }
        />
        <Route
          path='/profile'
          element={
            <RouteProtected>
              <Profile />
            </RouteProtected>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <RouteProtected>
              <ProfileOrders />
            </RouteProtected>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title='example' onClose={modalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='example' onClose={modalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <RouteProtected>
              <Modal title='example' onClose={modalClose}>
                <OrderInfo />
              </Modal>
            </RouteProtected>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
