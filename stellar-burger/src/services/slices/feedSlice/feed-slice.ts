import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../../utils/burger-api';

export type TFeedState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

const countTodayOrders = (orders: TOrder[]) => {
  const today = new Date().toDateString();
  return orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  ).length;
};

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feed/fetchOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Ошибка загрузки заказов');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addOrder(state, action) {
      state.orders.unshift(action.payload);
      state.total += 1;
      state.totalToday += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.total = action.payload.length;
        state.totalToday = countTodayOrders(action.payload);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки заказов';
      });
  }
});

export const { addOrder } = feedSlice.actions;
export default feedSlice.reducer;
