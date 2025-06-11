import { SELECTORS } from 'cypress/support/selectors';

describe('Оформление заказа — через UI', () => {
  beforeEach(() => {
    cy.fixture('ingredients').as('ingredients');

    cy.fixture('ingredients').then((data) => {
      cy.intercept('GET', '**/api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: data.ingredient
        }
      }).as('loadIngredients');
    });

    cy.intercept('POST', '/api/auth/login', {
      success: true,
      accessToken: 'Bearer mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { email: 'test@example.com', name: 'Test User' }
    }).as('login');

    cy.intercept('GET', '/api/auth/user', (req) => {
      if (req.headers.authorization === 'Bearer mock-access-token') {
        req.reply({
          success: true,
          user: { email: 'test@example.com', name: 'Test User' }
        });
      } else {
        req.reply({
          statusCode: 401,
          body: { message: 'Unauthorized' }
        });
      }
    }).as('getUser');

    cy.intercept('POST', '/api/orders', {
      success: true,
      name: 'Test Order',
      order: {
        number: 12345,
        _id: 'orderid123',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: ['id-bun', 'id-main']
      }
    }).as('createOrder');
  });

  it('логинимся, собираем бургер, оформляем заказ', function () {
    cy.visit('/login');

    cy.get(SELECTORS.FORM.EMAIL).type('student@student.ru', { force: true });
    cy.get(SELECTORS.FORM.PASSWORD).type('123456789', { force: true });
    cy.get(SELECTORS.FORM.SUBMIT).click({ force: true });

    cy.wait('@login');
    cy.url().should('include', '/');
    cy.wait('@loadIngredients');

    cy.get('@ingredients').its('ingredient').then((ingredient) => {
      const bun = ingredient.find((i: any) => i.type === 'bun');
      const main = ingredient.find((i: any) => i.type === 'main');

      cy.contains(bun.name).parents('li').find('button').click();
      cy.contains(main.name).parents('li').find('button').click();
    });

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@createOrder');

    cy.get('h2.text_type_digits-large').should('contain.text', '12345');

    cy.get(SELECTORS.MODAL.CLOSE).click();

    cy.get(SELECTORS.CONSTRUCTOR.BUN).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR.INGREDIENT).should('not.exist');
  });
});
