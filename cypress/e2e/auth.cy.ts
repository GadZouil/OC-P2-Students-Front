// cypress/e2e/auth.cy.ts

describe('Authentification - Register & Login', () => {

  it('should register a new user successfully', () => {
    // On mocke l’appel d’API /api/register
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: {},
    }).as('register');

    cy.visit('/register');

    // Remplir le formulaire
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="login"]').type('jdoe');
    cy.get('input[formControlName="password"]').type('password123');

    cy.get('form').submit();

    cy.wait('@register').its('request.body').should((body: any) => {
      expect(body.firstName).to.eq('John');
      expect(body.lastName).to.eq('Doe');
      expect(body.login).to.eq('jdoe');
    });

    // redirection vers /login
    cy.url().should('include', '/login');
  });

  it('should login and store token, then redirect to /students', () => {
    // on mocke /api/login pour renvoyer un token
    cy.intercept('POST', '/api/login', (req) => {
      expect(req.body.login).to.eq('jdoe');
      expect(req.body.password).to.eq('password123');

      req.reply({
        statusCode: 200,
        body: 'fake.jwt.token',
      });
    }).as('login');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type('jdoe');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('form').submit();

    cy.wait('@login');

    // localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.eq('fake.jwt.token');
    });

    // rediriger vers /students
    cy.url().should('include', '/students');
  });

  it('should show error message when login fails (bad credentials)', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Bad credentials' },
    }).as('loginFail');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type('wrong');
    cy.get('input[formControlName="password"]').type('wrongpwd');
    cy.get('form').submit();

    cy.wait('@loginFail');

    cy.contains('Bad credentials').should('exist');
  });
});
