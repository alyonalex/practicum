import { SELECTORS } from 'cypress/support/selectors';

describe('Ингредиент — модальное окно', () => {
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
    cy.visit('/');
    cy.wait('@loadIngredients');
  });

  it('открывает и отображает модалку с деталями', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.openIngredientModal(ingredient.name);
    cy.get(`${SELECTORS.MODAL.CONTENT} img`).should('have.attr', 'src', ingredient.image_large);
  });

  it('закрывается по клику на крестик', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.openIngredientModal(ingredient.name);
    cy.closeModal('close-button');
  });

  it('закрывается по клику на оверлей', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.openIngredientModal(ingredient.name);
    cy.closeModal('overlay');
  });
});
