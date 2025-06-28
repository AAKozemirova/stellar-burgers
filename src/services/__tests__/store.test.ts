import { configureStore } from '@reduxjs/toolkit';
import { constructorSlice } from '@/entities/constructor/model';
import { authSlice } from '@/entities/user/model';
import { baseApi } from '@/shared/api';

describe('Redux Store', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [constructorSlice.name]: constructorSlice.reducer,
        [authSlice.name]: authSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    });
  });

  it('should create store with initial state', () => {
    const state = store.getState();
    
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });

  it('should have constructor slice in state', () => {
    const state = store.getState();
    
    expect(state.constructorContent).toBeDefined();
    expect(state.constructorContent.ingredients).toEqual([]);
    expect(state.constructorContent.bun).toBeNull();
  });

  it('should have auth slice in state', () => {
    const state = store.getState();
    
    expect(state.authState).toBeDefined();
    expect(state.authState.isAuthenticated).toBe(false);
    expect(state.authState.isForgotPassword).toBe(false);
  });

  it('should have baseApi slice in state', () => {
    const state = store.getState();
    
    expect(state.baseApi).toBeDefined();
  });

  it('should return correct initial state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    
    // Диспатчим неизвестный экшен
    store.dispatch(unknownAction);
    const newState = store.getState();
    
    // Проверяем, что основные части состояния остались корректными
    expect(newState.constructorContent.ingredients).toEqual([]);
    expect(newState.constructorContent.bun).toBeNull();
    expect(newState.authState.isAuthenticated).toBe(false);
    expect(newState.authState.isForgotPassword).toBe(false);
  });

  it('should handle undefined state correctly', () => {
    // Тестируем каждый редьюсер с undefined состоянием
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    
    // Constructor slice
    const constructorState = constructorSlice.reducer(undefined, unknownAction);
    expect(constructorState).toEqual({
      ingredients: [],
      bun: null,
    });
    
    // Auth slice
    const authState = authSlice.reducer(undefined, unknownAction);
    expect(authState).toEqual({
      isAuthenticated: false,
      isForgotPassword: false,
    });
    
    // BaseApi slice
    const apiState = baseApi.reducer(undefined, unknownAction);
    expect(apiState).toBeDefined();
  });
}); 