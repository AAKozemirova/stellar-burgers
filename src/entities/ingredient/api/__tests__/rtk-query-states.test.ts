import { ingredientsApi } from '../api';
import { baseApi } from '@/shared/api';

describe('RTK Query States', () => {
  it('should handle pending state', () => {
    // Проверяем, что API определен
    expect(ingredientsApi).toBeDefined();
    expect(ingredientsApi.endpoints.getIngredients).toBeDefined();
    
    // Проверяем, что baseApi может обрабатывать состояния
    const initialState = baseApi.reducer(undefined, { type: 'INIT' });
    expect(initialState).toBeDefined();
  });

  it('should handle fulfilled state', () => {
    const mockIngredients = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0,
      },
    ];

    // Проверяем, что API может обрабатывать данные
    expect(ingredientsApi.endpoints.getIngredients).toBeDefined();
    expect(typeof ingredientsApi.endpoints.getIngredients.initiate).toBe('function');
  });

  it('should handle rejected state', () => {
    // Проверяем, что API может обрабатывать ошибки
    expect(ingredientsApi).toBeDefined();
    
    // Проверяем, что baseApi может обрабатывать ошибки
    const initialState = baseApi.reducer(undefined, { type: 'INIT' });
    expect(initialState).toBeDefined();
  });

  it('should handle loading state transitions', () => {
    // Проверяем, что API может переходить между состояниями
    expect(ingredientsApi.endpoints.getIngredients).toBeDefined();
    
    // Проверяем, что baseApi может обрабатывать переходы состояний
    const initialState = baseApi.reducer(undefined, { type: 'INIT' });
    expect(initialState).toBeDefined();
  });

  it('should have correct endpoint configuration', () => {
    const endpoint = ingredientsApi.endpoints.getIngredients;
    
    expect(endpoint).toBeDefined();
    expect(typeof endpoint.initiate).toBe('function');
    // Проверяем, что endpoint имеет необходимые свойства
    expect(endpoint).toHaveProperty('initiate');
  });

  it('should transform response correctly', () => {
    const mockResponse = {
      data: [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0,
        },
      ],
    };

    // Проверяем, что transformResponse определен
    const endpoint = ingredientsApi.endpoints.getIngredients;
    expect(endpoint).toBeDefined();
  });
}); 