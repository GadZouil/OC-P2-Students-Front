// cypress/support/e2e.ts

// Exemple : commande custom pour simuler un utilisateur déjà connecté
Cypress.Commands.add('loginAsFakeUser', () => {
  window.localStorage.setItem('token', 'fake.jwt.token');
});

// Pour éviter que les erreurs Angular dans la console fassent planter Cypress
Cypress.on('uncaught:exception', (err) => {
  // on ignore les erreurs de script sur la page
  return false;
});
