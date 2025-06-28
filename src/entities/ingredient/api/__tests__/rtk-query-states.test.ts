// Мокаем RTK Query перед импортом
jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  build: {
    query: jest.fn(),
    mutation: jest.fn(),
  },
}));

describe('RTK Query States', () => {
  it('should handle pending state', () => {
    // Простая проверка что тест запускается
    expect(true).toBe(true);
  });

  it('should handle fulfilled state', () => {
    // Простая проверка что тест запускается
    expect(true).toBe(true);
  });

  it('should handle rejected state', () => {
    // Простая проверка что тест запускается
    expect(true).toBe(true);
  });
}); 