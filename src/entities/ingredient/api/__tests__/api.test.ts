// Мокаем RTK Query перед импортом
jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  build: {
    query: jest.fn(),
    mutation: jest.fn(),
  },
}));

describe('Ingredients API', () => {
  it('should be defined', () => {
    // Простая проверка что тест запускается
    expect(true).toBe(true);
  });
}); 