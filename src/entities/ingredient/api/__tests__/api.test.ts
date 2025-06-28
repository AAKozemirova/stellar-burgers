import { ingredientsApi } from '../api';

// Мокаем RTK Query
jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  build: {
    query: jest.fn(),
    mutation: jest.fn(),
  },
}));

describe('Ingredients API', () => {
  it('should be defined', () => {
    expect(ingredientsApi).toBeDefined();
  });

  it('should have getIngredients endpoint', () => {
    expect(ingredientsApi.endpoints.getIngredients).toBeDefined();
  });

  it('should have correct endpoint configuration', () => {
    const endpoint = ingredientsApi.endpoints.getIngredients;
    
    expect(endpoint).toBeDefined();
    expect(typeof endpoint.initiate).toBe('function');
  });

  it('should export useGetIngredientsQuery hook', () => {
    expect(ingredientsApi.useGetIngredientsQuery).toBeDefined();
    expect(typeof ingredientsApi.useGetIngredientsQuery).toBe('function');
  });
}); 