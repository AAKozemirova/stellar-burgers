import { store } from '@/app/store';
import { ingredientsApi } from '../api';

describe('Ingredients API RTK Query States', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    store.dispatch(ingredientsApi.util.resetApiState());
  });

  describe('Request экшен', () => {
    it('должен устанавливать isLoading в true при вызове экшена Request', () => {
      // Симулируем pending состояние
      const pendingAction = {
        type: 'baseApi/executeQuery/pending',
        meta: {
          arg: { endpointName: 'getIngredients', originalArgs: undefined },
          requestId: 'test-request-id',
        },
      };

      store.dispatch(pendingAction);
      const state = store.getState();

      // Проверяем, что в baseApi есть pending запрос
      const queries = state.baseApi.queries;
      const pendingQuery = Object.values(queries).find(
        (query: any) => query?.status === 'pending'
      );

      expect(pendingQuery).toBeDefined();
      expect(pendingQuery?.status).toBe('pending');
    });
  });

  describe('Success экшен', () => {
    it('должен записывать данные в store и устанавливать isLoading в false при вызове экшена Success', () => {
      const mockIngredients = [
        {
          _id: 'test-id-1',
          name: 'Test Ingredient 1',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 100,
          price: 100,
          image: 'test-image-1.png',
          image_mobile: 'test-image-1-mobile.png',
          image_large: 'test-image-1-large.png',
          __v: 0,
        },
      ];

      // Симулируем fulfilled состояние
      const fulfilledAction = {
        type: 'baseApi/executeQuery/fulfilled',
        payload: mockIngredients,
        meta: {
          arg: { endpointName: 'getIngredients', originalArgs: undefined },
          requestId: 'test-request-id',
        },
      };

      store.dispatch(fulfilledAction);
      const state = store.getState();

      // Проверяем, что данные записаны в store
      const queries = state.baseApi.queries;
      const fulfilledQuery = Object.values(queries).find(
        (query: any) => query?.status === 'fulfilled'
      );

      expect(fulfilledQuery).toBeDefined();
      expect(fulfilledQuery?.status).toBe('fulfilled');
      expect(fulfilledQuery?.data).toEqual(mockIngredients);
    });
  });

  describe('Failed экшен', () => {
    it('должен записывать ошибку в store и устанавливать isLoading в false при вызове экшена Failed', () => {
      const mockError = {
        status: 500,
        data: { message: 'Internal Server Error' },
      };

      // Симулируем rejected состояние
      const rejectedAction = {
        type: 'baseApi/executeQuery/rejected',
        error: { message: 'Request failed' },
        payload: mockError,
        meta: {
          arg: { endpointName: 'getIngredients', originalArgs: undefined },
          requestId: 'test-request-id',
        },
      };

      store.dispatch(rejectedAction);
      const state = store.getState();

      // Проверяем, что ошибка записана в store
      const queries = state.baseApi.queries;
      const rejectedQuery = Object.values(queries).find(
        (query: any) => query?.status === 'rejected'
      );

      expect(rejectedQuery).toBeDefined();
      expect(rejectedQuery?.status).toBe('rejected');
      expect(rejectedQuery?.error).toBeDefined();
    });
  });

  describe('Полный цикл запроса', () => {
    it('должен правильно обрабатывать полный цикл: pending -> fulfilled', () => {
      const mockIngredients = [
        {
          _id: 'test-id-1',
          name: 'Test Ingredient 1',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 100,
          price: 100,
          image: 'test-image-1.png',
          image_mobile: 'test-image-1-mobile.png',
          image_large: 'test-image-1-large.png',
          __v: 0,
        },
      ];

      const requestId = 'test-request-id';
      const endpointName = 'getIngredients';

      // 1. Pending состояние
      const pendingAction = {
        type: 'baseApi/executeQuery/pending',
        meta: {
          arg: { endpointName, originalArgs: undefined },
          requestId,
        },
      };

      store.dispatch(pendingAction);
      let state = store.getState();
      let query = Object.values(state.baseApi.queries).find(
        (q: any) => q?.status === 'pending'
      );
      expect(query?.status).toBe('pending');

      // 2. Fulfilled состояние
      const fulfilledAction = {
        type: 'baseApi/executeQuery/fulfilled',
        payload: mockIngredients,
        meta: {
          arg: { endpointName, originalArgs: undefined },
          requestId,
        },
      };

      store.dispatch(fulfilledAction);
      state = store.getState();
      query = Object.values(state.baseApi.queries).find(
        (q: any) => q?.status === 'fulfilled'
      );
      expect(query?.status).toBe('fulfilled');
      expect(query?.data).toEqual(mockIngredients);
    });

    it('должен правильно обрабатывать полный цикл: pending -> rejected', () => {
      const requestId = 'test-request-id';
      const endpointName = 'getIngredients';

      // 1. Pending состояние
      const pendingAction = {
        type: 'baseApi/executeQuery/pending',
        meta: {
          arg: { endpointName, originalArgs: undefined },
          requestId,
        },
      };

      store.dispatch(pendingAction);
      let state = store.getState();
      let query = Object.values(state.baseApi.queries).find(
        (q: any) => q?.status === 'pending'
      );
      expect(query?.status).toBe('pending');

      // 2. Rejected состояние
      const rejectedAction = {
        type: 'baseApi/executeQuery/rejected',
        error: { message: 'Request failed' },
        meta: {
          arg: { endpointName, originalArgs: undefined },
          requestId,
        },
      };

      store.dispatch(rejectedAction);
      state = store.getState();
      query = Object.values(state.baseApi.queries).find(
        (q: any) => q?.status === 'rejected'
      );
      expect(query?.status).toBe('rejected');
      expect(query?.error).toBeDefined();
    });
  });
}); 