import '@4tw/cypress-drag-drop';
import { selectors, api } from '../constants';

describe('E2E тестирование конструктора бургера', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Добавление булки в конструктор', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa093c"]').should('be.visible');
    });

    it('Добавление начинки в конструктор', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0941"]').should('be.visible');
    });

    it('Добавление соуса в конструктор', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0942"]').should('be.visible');
    });

    it('Добавление нескольких ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa093c"]').should('be.visible');
      
      // Добавляем начинку
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0941"]').should('be.visible');
      
      // Добавляем соус
      cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0942"]').should('be.visible');
    });
  });

  describe('Работа с модальными окнами ингредиентов', () => {
    it('Открытие модального окна ингредиента', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="close-modal"]').should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      // Кликаем на оверлей (вне модального окна)
      cy.get('body').click(0, 0);
      cy.get('[data-cy="close-modal"]').should('not.exist');
    });

    it('Отображение данных правильного ингредиента в модальном окне', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('4242').should('be.visible'); // калории
      cy.contains('424').should('be.visible'); // цена
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'Bearer test-access-token-12345');
      cy.setCookie('refreshToken', 'test-refresh-token-67890');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.reload();
    });

    afterEach(() => {
      cy.clearCookies();
    });

    it('Создание заказа с полным бургером', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa093c"]').should('be.visible');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0941"]').should('be.visible');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0942"]').should('be.visible');
      cy.contains('Оформить заказ').should('not.be.disabled');
      cy.contains('Оформить заказ').click({ force: true });
      cy.wait('@postOrder');
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.contains('12345').should('be.visible');
      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="close-modal"]').should('not.exist');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa093c"]').should('not.exist');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0941"]').should('not.exist');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0942"]').should('not.exist');
    });

    it('Проверка невозможности создания заказа без булки', () => {
      // Добавляем только начинку без булки
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa0941"]').should('be.visible');
      
      // Кнопка "Оформить заказ" должна быть неактивна
      cy.contains('Оформить заказ').should('be.disabled');
    });

    it('Проверка невозможности создания заказа с одной булкой', () => {
      // Добавляем только булку
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').drag('[data-cy="constructor-container"]');
      cy.get('[data-cy="set-643d69a5c3f7b9001cfa093c"]').should('be.visible');
      
      // Кнопка "Оформить заказ" должна быть неактивна (нужна булка + минимум 2 ингредиента)
      cy.contains('Оформить заказ').should('be.disabled');
    });
  });
});
