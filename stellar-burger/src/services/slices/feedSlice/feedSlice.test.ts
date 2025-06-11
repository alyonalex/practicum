import { TOrder } from '@utils-types';
import reducer, { addOrder, fetchOrders, TFeedState } from './feed-slice';

const initialState: TFeedState = {
      orders: [],
      isLoading: false,
      error: null,
      total: 0,
      totalToday: 0
    }

describe('feedSlice', () => {

    it('добавление заказа и увеличение счётчиков', () => {
    const order = { _id: '1', createdAt: new Date().toISOString() } as any;
    const state = reducer(initialState, addOrder(order));
    expect(state.orders[0]).toEqual(order);
    expect(state.total).toBe(1);
    expect(state.totalToday).toBe(1);
    });
});

describe('feedSlice async reducers', () => {
  const mockOrders: TOrder[] = [
    { _id: '1', createdAt: new Date().toISOString() } as TOrder
  ];

  it('начало загрузки заказов', () => {
    const action = { type: fetchOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('успешная загрузка заказов', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(mockOrders.length);
    expect(state.totalToday).toBeGreaterThanOrEqual(0);
  });

  it('ошибка загрузки заказов', () => {
    const action = {
      type: fetchOrders.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
