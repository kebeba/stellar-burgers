import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  getCurrentOrderSelector,
  getOrderLoadingStatusSelector,
  makeOrder,
  clearOrderData
} from '../../services/slices/orders-slice';
import {
  check4Bun,
  getIngredients,
  clearIngredients
} from '../../services/slices/constructor-slice';
import { getUserAuthStatus } from '../../services/slices/auth-slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(check4Bun);
  const ingredients = useSelector(getIngredients);
  const orderModalData = useSelector(getCurrentOrderSelector);
  const orderRequest = useSelector(getOrderLoadingStatusSelector);
  const isUserAuth = useSelector(getUserAuthStatus);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!isUserAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun) {
      return;
    }
    if (!bun || ingredients.length == 0 || orderRequest) {
      return;
    }
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(makeOrder(ingredientIds));
    dispatch(clearIngredients());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
