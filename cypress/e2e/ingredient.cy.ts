import '@4tw/cypress-drag-drop';

describe('E2E тестирование просмотра деталей ингредиента', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Работа с модальными окнами ингредиентов', () => {
    it('Открытие модального окна с деталями ингредиента', () => {
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

    it('Работоспособность модального окна после перезагрузки страницы', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.reload();
      // После перезагрузки модальное окно должно остаться открытым
      cy.get('[data-cy="close-modal"]').should('be.visible');
    });

    it('Отображение данных правильного ингредиента в модальном окне', () => {
      // Проверяем данные булки
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('420').should('be.visible'); // калории
      cy.contains('1255').should('be.visible'); // цена
      cy.get('[data-cy="close-modal"]').click();

      // Проверяем данные начинки
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('4242').should('be.visible'); // калории
      cy.contains('424').should('be.visible'); // цена
      cy.get('[data-cy="close-modal"]').click();

      // Проверяем данные соуса
      cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      cy.contains('Соус Spicy-X').should('be.visible');
      cy.contains('30').should('be.visible'); // калории
      cy.contains('90').should('be.visible'); // цена
    });

    it('Проверка отображения характеристик ингредиента', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="close-modal"]').should('be.visible');
      
      // Проверяем наличие названия и изображения
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.get('img').should('be.visible');
      
      // Проверяем основные значения
      cy.contains('420').should('be.visible'); // калории
      cy.contains('1255').should('be.visible'); // цена
    });
  });
});
