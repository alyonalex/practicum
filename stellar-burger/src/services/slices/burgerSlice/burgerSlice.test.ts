import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  BurgerState,
  addBun,
  placeOrder,
  closeOrderModal
} from './burger-slice';

describe('burgerSlice', () => {

  const initialState: BurgerState = {
    constructorItems: {
        bun: null,
        ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  };
  
  const ingredient = { _id: '123', name: 'test', type: 'main', price: 10 };

  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('добавление ингредиента', () => {
    const state = reducer(initialState, addIngredient(ingredient as any));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]._id).toBe('123');
  });

  it('удаление ингредиента', () => {
    const filledState = reducer(initialState, addIngredient(ingredient as any));
    const state = reducer(filledState, removeIngredient(0));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('перемещение ингредиента', () => {
    let state = reducer(initialState, addIngredient({ ...ingredient, _id: '1' } as any));
    state = reducer(state, addIngredient({ ...ingredient, _id: '2' } as any));
    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(state.constructorItems.ingredients[0]._id).toBe('2');
    expect(state.constructorItems.ingredients[1]._id).toBe('1');
  });

  it('установка булки', () => {
    const bun = { _id: 'bun1', name: 'Булка', type: 'bun', price: 5 } as any;
    const state = reducer(initialState, addBun(bun));
    expect(state.constructorItems.bun).toEqual(bun);
  });

  it('очистка конструктора', () => {
    const prefilledState = {
      ...initialState,
      constructorItems: {
        bun: { _id: 'bun1', name: 'Булка', type: 'bun', price: 5 } as any,
        ingredients: [{ _id: 'ing1', name: 'test', type: 'main', price: 10 } as any]
      }
    };
    const state = reducer(prefilledState, clearConstructor());
    expect(state.constructorItems).toEqual({ bun: null, ingredients: [] });
  });

  it('начало оформления заказа', () => {
    const state = reducer(undefined, { type: placeOrder.pending.type });
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('успешное оформление заказа', () => {
    const orderData = { number: 1234 };
    const prefilledState = {
      ...initialState,
      constructorItems: {
        bun: { _id: 'bun1', name: 'Булка', type: 'bun', price: 5 } as any,
        ingredients: [{ _id: 'ing1', name: 'test', type: 'main', price: 10 } as any]
      }
    };
    const state = reducer(prefilledState, {
      type: placeOrder.fulfilled.type,
      payload: orderData
    });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(orderData);
    expect(state.constructorItems).toEqual({ bun: null, ingredients: [] });
  });

  it('ошибка оформления заказа', () => {
    const state = reducer(undefined, {
      type: placeOrder.rejected.type,
      payload: 'Ошибка заказа'
    });
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });

  it('закрытие модального окна заказа', () => {
    const prefilledState = {
      ...initialState,
      orderModalData: { number: 123 } as any,
      error: 'Ошибка'
    };
    const state = reducer(prefilledState, closeOrderModal());
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
