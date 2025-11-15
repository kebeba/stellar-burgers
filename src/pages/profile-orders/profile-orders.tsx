import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersSelector
} from '../../services/slices/orders-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrdersSelector);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
