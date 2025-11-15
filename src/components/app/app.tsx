import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(requestIngredients());
  }, [dispatch]);
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const modalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <RouteProtected>
              <OrderInfo />
            </RouteProtected>
          }
        />
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
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={modalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={modalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <RouteProtected>
                <Modal title='Детали заказа' onClose={modalClose}>
                  <OrderInfo />
                </Modal>
              </RouteProtected>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
