import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getSpecifiedOrder,
  getModalOrderSelector,
  getOrderErrorTextSelector,
  getOrderLoadingStatusSelector
} from '../../services/slices/orders-slice';
import {
  fetchIngredients,
  getLoadingStatus,
  check4Error
} from '../../services/slices/assortment-slice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderData = useSelector(getModalOrderSelector);
  const ingredients: TIngredient[] = useSelector(fetchIngredients);
  const orderLoadingStatus = useSelector(getOrderLoadingStatusSelector);
  const orderErrorText = useSelector(getOrderErrorTextSelector);
  const ingredientsLoadingStatus = useSelector(getLoadingStatus);
  const ingredientsErrorText = useSelector(check4Error);

  useEffect(() => {
    if (number) {
      dispatch(getSpecifiedOrder(Number(number)));
    }
  }, [number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (
      !orderData ||
      !ingredients.length ||
      ingredientsLoadingStatus ||
      orderLoadingStatus
    )
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients, ingredientsLoadingStatus, orderLoadingStatus]);

  if (ingredientsLoadingStatus || orderLoadingStatus) {
    return <Preloader />;
  }

  if (orderErrorText) {
    return <div>Ошибка загрузки заказа: {orderErrorText}</div>;
  }

  if (ingredientsErrorText) {
    return (
      <div>Ошибка загрузки списка ингредиентов: {ingredientsErrorText}</div>
    );
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
