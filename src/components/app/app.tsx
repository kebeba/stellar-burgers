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
import { Route, Routes } from 'react-router-dom';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  RouteProtected
} from '@components';

function App() {
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
            <RouteProtected>
              <Login />
            </RouteProtected>
          }
        />
        <Route
          path='/register'
          element={
            <RouteProtected>
              <Register />
            </RouteProtected>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RouteProtected>
              <ForgotPassword />
            </RouteProtected>
          }
        />
        <Route
          path='/reset-password'
          element={
            <RouteProtected>
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
