import { SELECTORS } from 'cypress/support/selectors';

describe('Конструктор бургера — базовое взаимодействие', () => {
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

  it('показывает ингредиенты и добавляет булку и начинку', function () {
    const bun = this.ingredients.ingredient.find((i: any) => i.type === 'bun');
    const main = this.ingredients.ingredient.find((i: any) => i.type === 'main');

    cy.contains(bun.name).parents('li').find('button').click();
    cy.contains(main.name).parents('li').find('button').click();

    cy.contains(`${bun.name} (верх)`).should('exist');
    cy.contains(`${bun.name} (низ)`).should('exist');

    cy.get(SELECTORS.CONSTRUCTOR.INGREDIENT)
      .find(`${SELECTORS.CONSTRUCTOR.INGREDIENT}__text`)
      .should('contain.text', main.name);
  });
});
