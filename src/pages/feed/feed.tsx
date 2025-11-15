import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getOrdersFeedSelector,
  fetchOrders
} from '../../services/slices/orders-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersFeedSelector);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
