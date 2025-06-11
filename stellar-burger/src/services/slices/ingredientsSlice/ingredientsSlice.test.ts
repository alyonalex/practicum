import reducer, { fetchIngredients, IngredientsState } from './ingredients-slice';

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    data: [],
    isLoading: false,
    error: null
  };

  it('начало загрузки ингредиентов', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('успешная загрузка ингредиентов', () => {
    const mockData = [{ _id: '1', name: 'cheese' }];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockData
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockData);
  });

  it('ошибка загрузки ингредиентов', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
