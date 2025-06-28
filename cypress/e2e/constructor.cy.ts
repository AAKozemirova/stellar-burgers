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
      cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_bun).should('be.visible');
    });

    it('Добавление начинки в конструктор', () => {
      cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_main).should('be.visible');
    });

    it('Добавление соуса в конструктор', () => {
      cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
    });

    it('Добавление нескольких ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_bun).should('be.visible');
      
      // Добавляем начинку
      cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_main).should('be.visible');
      
      // Добавляем соус
      cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
    });
  });

  describe('Работа с модальными окнами ингредиентов', () => {
    it('Открытие модального окна ингредиента', () => {
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
      // Кликаем на оверлей (вне модального окна)
      cy.get('body').click(0, 0);
      cy.get(selectors.close_modal).should('not.exist');
    });

    it('Отображение данных правильного ингредиента в модальном окне', () => {
      cy.get(selectors.ingredient_main).click();
      cy.get(selectors.close_modal).should('be.visible');
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
      cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
      cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
      cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_bun).should('be.visible');
      cy.get(selectors.constructor_ingredient_main).should('be.visible');
      cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
      cy.get('button').contains(selectors.order_button).should('not.be.disabled');
      cy.get('button').contains(selectors.order_button).click({ force: true });
      cy.wait('@postOrder');
      cy.get(selectors.close_modal).should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.contains('12345').should('be.visible');
      cy.get(selectors.close_modal).click();
      cy.get(selectors.close_modal).should('not.exist');
      cy.get(selectors.constructor_ingredient_bun).should('not.exist');
      cy.get(selectors.constructor_ingredient_main).should('not.exist');
      cy.get(selectors.constructor_ingredient_sauce).should('not.exist');
    });

    it('Проверка невозможности создания заказа без булки', () => {
      // Добавляем только начинку без булки
      cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_main).should('be.visible');
      
      // Кнопка "Оформить заказ" должна быть неактивна
      cy.get('button').contains(selectors.order_button).should('be.disabled');
    });

    it('Проверка невозможности создания заказа с одной булкой', () => {
      // Добавляем только булку
      cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_bun).should('be.visible');
      
      // Кнопка "Оформить заказ" должна быть неактивна (нужна булка + минимум 2 ингредиента)
      cy.get('button').contains(selectors.order_button).should('be.disabled');
    });
  });

  describe('Тестирование для неавторизованного пользователя', () => {
    it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
      cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_bun).should('be.visible');
      cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_main).should('be.visible');
      cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
      cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
      cy.get('button').contains(selectors.order_button).click();
      cy.get('p').contains(selectors.login_page_text).should('be.visible');
    });
  });
});
