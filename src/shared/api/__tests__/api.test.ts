import { baseApi } from '../api';

// Мокаем fetch для тестов
global.fetch = jest.fn();

describe('Base API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(baseApi).toBeDefined();
  });

  it('should have correct reducerPath', () => {
    expect(baseApi.reducerPath).toBe('baseApi');
  });

  it('should have endpoints defined', () => {
    expect(baseApi.endpoints).toBeDefined();
  });
}); 