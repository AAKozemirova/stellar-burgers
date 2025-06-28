import { constructorSlice, addIngredient, addBun, removeIngredient, moveIngredient, clearConstructor } from '../slice';

describe('Constructor Slice', () => {
  const initialState = {
    ingredients: [],
    bun: null,
  };

  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    constructorSlice.reducer(undefined, { type: 'INIT' });
  });

  describe('addIngredient', () => {
    it('должен добавлять ингредиент в список ингредиентов', () => {
      const ingredientId = 'test-ingredient-id';
      const action = addIngredient(ingredientId);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(ingredientId);
      expect(newState.ingredients[0].uniqueId).toBeDefined();
    });

    it('должен добавлять несколько ингредиентов', () => {
      const ingredientId1 = 'test-ingredient-1';
      const ingredientId2 = 'test-ingredient-2';

      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient(ingredientId1));
      state = constructorSlice.reducer(state, addIngredient(ingredientId2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(ingredientId1);
      expect(state.ingredients[1]._id).toBe(ingredientId2);
    });
  });

  describe('addBun', () => {
    it('должен устанавливать булку', () => {
      const bunId = 'test-bun-id';
      const action = addBun(bunId);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.bun).toBe(bunId);
    });

    it('должен заменять существующую булку', () => {
      const bunId1 = 'test-bun-1';
      const bunId2 = 'test-bun-2';

      let state = initialState;
      state = constructorSlice.reducer(state, addBun(bunId1));
      state = constructorSlice.reducer(state, addBun(bunId2));

      expect(state.bun).toBe(bunId2);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по индексу', () => {
      const ingredientId = 'test-ingredient-id';
      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient(ingredientId));
      state = constructorSlice.reducer(state, addIngredient('another-ingredient'));

      expect(state.ingredients).toHaveLength(2);

      const action = removeIngredient({ index: 0 });
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('another-ingredient');
    });

    it('должен удалять ингредиент по id', () => {
      const ingredientId = 'test-ingredient-id';
      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient(ingredientId));
      state = constructorSlice.reducer(state, addIngredient('another-ingredient'));

      expect(state.ingredients).toHaveLength(2);

      const action = removeIngredient({ id: ingredientId });
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('another-ingredient');
    });

    it('должен удалять булку если id совпадает', () => {
      const bunId = 'test-bun-id';
      let state = initialState;
      state = constructorSlice.reducer(state, addBun(bunId));

      expect(state.bun).toBe(bunId);

      const action = removeIngredient({ id: bunId });
      state = constructorSlice.reducer(state, action);

      expect(state.bun).toBeNull();
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент с одной позиции на другую', () => {
      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient('ingredient-1'));
      state = constructorSlice.reducer(state, addIngredient('ingredient-2'));
      state = constructorSlice.reducer(state, addIngredient('ingredient-3'));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe('ingredient-1');
      expect(state.ingredients[1]._id).toBe('ingredient-2');
      expect(state.ingredients[2]._id).toBe('ingredient-3');

      const action = moveIngredient({ fromElement: 0, toElement: 2 });
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe('ingredient-2');
      expect(state.ingredients[1]._id).toBe('ingredient-3');
      expect(state.ingredients[2]._id).toBe('ingredient-1');
    });

    it('не должен изменять состояние если fromElement или toElement не определены', () => {
      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient('ingredient-1'));
      state = constructorSlice.reducer(state, addIngredient('ingredient-2'));

      const stateBeforeMove = { ...state };

      const action = moveIngredient({ fromElement: undefined, toElement: 1 });
      state = constructorSlice.reducer(state, action);

      expect(state).toEqual(stateBeforeMove);
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать все ингредиенты и булку', () => {
      let state = initialState;
      state = constructorSlice.reducer(state, addIngredient('ingredient-1'));
      state = constructorSlice.reducer(state, addIngredient('ingredient-2'));
      state = constructorSlice.reducer(state, addBun('bun-id'));

      expect(state.ingredients).toHaveLength(2);
      expect(state.bun).toBe('bun-id');

      const action = clearConstructor();
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients).toHaveLength(0);
      expect(state.bun).toBeNull();
    });
  });
}); 