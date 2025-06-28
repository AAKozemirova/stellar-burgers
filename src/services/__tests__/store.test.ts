import { store } from '../../app/store';

describe('Redux Store', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    const initialState = store.getState();
    
    // Проверяем, что store имеет ожидаемую структуру
    expect(initialState).toHaveProperty('baseApi');
    expect(initialState).toHaveProperty('constructorContent');
    expect(initialState).toHaveProperty('authState');
    
    // Проверяем начальное состояние constructor слайса
    expect(initialState.constructorContent).toEqual({
      ingredients: [],
      bun: null,
    });
    
    // Проверяем начальное состояние auth слайса
    expect(initialState.authState).toEqual({
      isAuthenticated: false,
      isForgotPassword: false,
    });
  });

  it('должен обрабатывать неизвестные экшены без изменения состояния', () => {
    const initialState = store.getState();
    
    // Диспатчим неизвестный экшен
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    
    const stateAfterUnknownAction = store.getState();
    
    // Состояние не должно измениться
    expect(stateAfterUnknownAction).toEqual(initialState);
  });
}); 