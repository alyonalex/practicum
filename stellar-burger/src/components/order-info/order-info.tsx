import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, RootState } from '../../../src/services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number: orderNumber } = useParams<{ number?: string }>();

  const allIngredients = useSelector(
    (state: RootState) => state.ingredients.data
  );

  const allOrders = useSelector((state: RootState) => state.feed.orders);

  const modalOrderData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );

  const currentOrder = useMemo<TOrder | null>(() => {
    if (modalOrderData) return modalOrderData;
    if (!orderNumber) return null;

    const parsedNumber = Number(orderNumber);
    return allOrders.find((order) => order.number === parsedNumber) ?? null;
  }, [modalOrderData, allOrders, orderNumber]);

  interface IngredientWithCount extends TIngredient {
    count: number;
  }

  const detailedOrder = useMemo(() => {
    if (!currentOrder || allIngredients.length === 0) return null;

    const createdAtDate = new Date(currentOrder.createdAt);

    const ingredientCounts: Record<string, IngredientWithCount> = {};

    currentOrder.ingredients.forEach((id) => {
      const ingredient = allIngredients.find((ing) => ing._id === id);
      if (ingredient) {
        if (!ingredientCounts[id]) {
          ingredientCounts[id] = {
            ...ingredient,
            count: ingredient.type === 'bun' ? 2 : 1
          };
        } else {
          ingredientCounts[id].count++;
        }
      }
    });

    const ingredientsWithCount = Object.fromEntries(
      Object.values(ingredientCounts).map((ing) => [ing._id, ing])
    );

    const totalPrice = Object.values(ingredientsWithCount).reduce(
      (acc, ing) => {
        if (ing.type === 'bun') {
          return acc + ing.price * 2;
        }
        return acc + ing.price * ing.count;
      },
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo: ingredientsWithCount,
      total: totalPrice,
      date: createdAtDate
    };
  }, [currentOrder, allIngredients]);

  if (!detailedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={detailedOrder} />;
};
