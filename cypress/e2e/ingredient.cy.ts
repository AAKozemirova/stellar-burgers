import '@4tw/cypress-drag-drop';
import { selectors, api } from '../constants';

describe('E2E тестирование ингредиентов', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Отображение ингредиентов', () => {
    it('Проверка отображения всех категорий ингредиентов', () => {
      cy.get(selectors.ingredient_bun).should('be.visible');
      cy.get(selectors.ingredient_main).should('be.visible');
      cy.get(selectors.ingredient_sauce).should('be.visible');
    });

    it('Проверка отображения названий ингредиентов', () => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Соус Spicy-X').should('be.visible');
    });

    it('Проверка отображения цен ингредиентов', () => {
      cy.get(selectors.ingredient_bun).within(() => {
        cy.contains('1255').should('be.visible');
      });
      cy.get(selectors.ingredient_main).within(() => {
        cy.contains('424').should('be.visible');
      });
      cy.get(selectors.ingredient_sauce).within(() => {
        cy.contains('90').should('be.visible');
      });
    });
  });

  describe('Работа с модальными окнами', () => {
    it('Открытие модального окна при клике на ингредиент', () => {
      cy.get(selectors.ingredient_bun).click();
      cy.get(selectors.close_modal).should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get(selectors.ingredient_bun).click();
      cy.get(selectors.close_modal).should('be.visible');
      cy.get(selectors.close_modal).click();
      cy.get(selectors.close_modal).should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get(selectors.ingredient_bun).click();
      cy.get(selectors.close_modal).should('be.visible');
      cy.get('body').click(0, 0);
      cy.get(selectors.close_modal).should('not.exist');
    });

    it('Отображение детальной информации об ингредиенте', () => {
      cy.get(selectors.ingredient_main).click();
      cy.get(selectors.close_modal).should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('4242').should('be.visible'); // калории
      cy.contains('424').should('be.visible'); // цена
      cy.contains('Белки, г').should('be.visible');
      cy.contains('Жиры, г').should('be.visible');
      cy.contains('Углеводы, г').should('be.visible');
    });
  });

  describe('Навигация по категориям', () => {
    it('Переключение между категориями ингредиентов', () => {
      // Проверяем, что булки отображаются по умолчанию
      cy.get(selectors.ingredient_bun).should('be.visible');
      
      // Переключаемся на соусы
      cy.contains(selectors.tab_sauce).click();
      cy.get(selectors.ingredient_sauce).should('be.visible');
      
      // Переключаемся на начинки
      cy.contains(selectors.tab_main).click();
      cy.get(selectors.ingredient_main).should('be.visible');
    });
  });
});
