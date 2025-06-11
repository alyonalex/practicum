/// <reference types="cypress" />

import { SELECTORS } from './selectors';

Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName).click();
  cy.get(SELECTORS.MODAL.CONTENT).should('contain.text', ingredientName);
});

Cypress.Commands.add('closeModal', (method: 'close-button' | 'overlay') => {
  if (method === 'close-button') {
    cy.get(SELECTORS.MODAL.CLOSE).click();
  } else {
    cy.get(SELECTORS.MODAL.OVERLAY).click({ force: true });
  }
  cy.get(SELECTORS.MODAL.CONTENT).should('not.exist');
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(method: 'close-button' | 'overlay'): Chainable<void>;
    }
  }
}

export {}