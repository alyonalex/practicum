import reducer, {
  clearAuth,
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './auth-slice';

describe('authSlice', () => {
  describe('синхронные экшены', () => {
    it('сброс авторизации', () => {
      const prevState = {
        isAuthenticated: true,
        user: { name: 'Test', email: 'test@example.com' },
        error: 'Some error',
        loading: true,
        checked: true
      };
      const state = reducer(prevState, clearAuth());
      expect(state).toEqual({
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
        checked: true
      });
    });

    it('возвращает начальное состояние', () => {
      expect(reducer(undefined, { type: '@@INIT' })).toEqual({
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
        checked: false
      });
    });
  });

  describe('loginUser', () => {
    it('loginUser.pending - начало загрузки', () => {
      const state = reducer(undefined, { type: loginUser.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешный вход', () => {
      const user = { name: 'Test', email: 'test@example.com' };
      const state = reducer(undefined, {
        type: loginUser.fulfilled.type,
        payload: user
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('ошибка входа', () => {
      const state = reducer(undefined, {
        type: loginUser.rejected.type,
        payload: 'Ошибка входа'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('logoutUser', () => {
    it('успешный выход', () => {
      const state = reducer(
        {
          isAuthenticated: true,
          user: { name: 'Test', email: 'test@example.com' },
          error: null,
          loading: false,
          checked: true
        },
        { type: logoutUser.fulfilled.type }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('успешная регистрация', () => {
      const user = { name: 'New User', email: 'test@example.com' };
      const state = reducer(undefined, {
        type: registerUser.fulfilled.type,
        payload: user
      });
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('ошибка регистрации', () => {
      const state = reducer(undefined, {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации'
      });
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('fetchUser', () => {
    it('успешное получение пользователя', () => {
      const user = { name: 'Fetched User', email: 'test@example.com' };
      const state = reducer(undefined, {
        type: fetchUser.fulfilled.type,
        payload: user
      });
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.checked).toBe(true);
    });

    it('ошибка при получении пользователя', () => {
      const state = reducer(undefined, {
        type: fetchUser.rejected.type
      });
      expect(state.checked).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('успешное обновление пользователя', () => {
      const updatedUser = { name: 'Updated Name', email: 'test@example.com' };
      const state = reducer(undefined, {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      });
      expect(state.user).toEqual(updatedUser);
    });

    it('ошибка обновления пользователя', () => {
      const state = reducer(undefined, {
        type: updateUser.rejected.type,
        payload: 'Ошибка обновления'
      });
      expect(state.error).toBe('Ошибка обновления');
    });
  });
});
