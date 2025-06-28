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
}); 