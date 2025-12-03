// cypress/e2e/students.cy.ts

describe('Students CRUD E2E', () => {

  beforeEach(() => {
    // On simule un utilisateur déjà connecté
    cy.loginAsFakeUser();
  });

  it('should list students on /students', () => {
    const students = [
      { id: 1, firstName: 'Alice', lastName: 'Wonder', email: 'alice@mail.com' },
      { id: 2, firstName: 'Bob', lastName: 'Builder', email: 'bob@mail.com' },
    ];

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: students,
    }).as('getStudents');

    cy.visit('/students');

    cy.wait('@getStudents');

    cy.contains('Alice').should('exist');
    cy.contains('Bob').should('exist');
  });

  it('should display error message if loading students fails', () => {
    cy.intercept('GET', '/api/students', {
      statusCode: 500,
      body: { message: 'Erreur serveur' },
    }).as('getStudentsError');

    cy.visit('/students');

    cy.wait('@getStudentsError');

    cy.contains('Erreur lors du chargement des étudiants').should('exist');
  });

  it('should create a new student from /students/new', () => {
    const studentsAfter = [
      { id: 1, firstName: 'Alice', lastName: 'Wonder', email: 'alice@mail.com' },
      { id: 3, firstName: 'Tom', lastName: 'Thumb', email: 'tom@mail.com' },
    ];

    cy.intercept('POST', '/api/students', (req) => {
      expect(req.body.firstName).to.eq('Tom');
      expect(req.body.lastName).to.eq('Thumb');
      expect(req.body.email).to.eq('tom@mail.com');

      req.reply({
        statusCode: 201,
        body: { id: 3, ...req.body },
      });
    }).as('createStudent');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: studentsAfter,
    }).as('getStudentsAfterCreate');

    cy.visit('/students/new');

    cy.get('input[formControlName="firstName"]').type('Tom');
    cy.get('input[formControlName="lastName"]').type('Thumb');
    cy.get('input[formControlName="email"]').type('tom@mail.com');

    cy.get('form').submit();

    cy.wait('@createStudent');
    cy.wait('@getStudentsAfterCreate');

    cy.contains('Tom').should('exist');
  });

  it('should load student and update it from /students/:id/edit', () => {
    const existingStudent = {
      id: 5,
      firstName: 'Tom',
      lastName: 'Thumb',
      email: 'tom@mail.com',
    };

    cy.intercept('GET', '/api/students/5', {
      statusCode: 200,
      body: existingStudent,
    }).as('getStudent5');

    cy.intercept('PUT', '/api/students/5', (req) => {
      expect(req.body.firstName).to.eq('Tommy');
      expect(req.body.lastName).to.eq('Thumb');
      expect(req.body.email).to.eq('tom@mail.com');

      req.reply({
        statusCode: 200,
        body: { id: 5, ...req.body },
      });
    }).as('updateStudent5');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        { id: 5, firstName: 'Tommy', lastName: 'Thumb', email: 'tom@mail.com' },
      ],
    }).as('getStudentsAfterUpdate');

    cy.visit('/students/5/edit');

    cy.wait('@getStudent5');

    cy.get('input[formControlName="firstName"]').should('have.value', 'Tom');
    cy.get('input[formControlName="lastName"]').should('have.value', 'Thumb');
    cy.get('input[formControlName="email"]').should('have.value', 'tom@mail.com');

    cy.get('input[formControlName="firstName"]').clear().type('Tommy');

    cy.get('form').submit();

    cy.wait('@updateStudent5');
    cy.wait('@getStudentsAfterUpdate');

    cy.contains('Tommy').should('exist');
  });

  it('should show student detail on /students/:id', () => {
    const student = {
      id: 10,
      firstName: 'Luna',
      lastName: 'Lovegood',
      email: 'luna@mail.com',
    };

    cy.intercept('GET', '/api/students/10', {
      statusCode: 200,
      body: student,
    }).as('getStudent10');

    cy.visit('/students/10');

    cy.wait('@getStudent10');

    cy.contains('Luna').should('exist');
    cy.contains('Lovegood').should('exist');
    cy.contains('luna@mail.com').should('exist');
  });

  it('should delete a student from the list', () => {
    const initialStudents = [
        { id: 1, firstName: 'Alice', lastName: 'Wonder', email: 'alice@mail.com' },
        { id: 2, firstName: 'Bob', lastName: 'Builder', email: 'bob@mail.com' },
    ];

    const afterDelete = [
        { id: 1, firstName: 'Alice', lastName: 'Wonder', email: 'alice@mail.com' },
    ];

    let callCount = 0;

    cy.intercept('GET', '/api/students', (req) => {
        if (callCount === 0) {
        callCount++;
        req.reply({
            statusCode: 200,
            body: initialStudents,
        });
        } else {
        req.reply({
            statusCode: 200,
            body: afterDelete,
        });
        }
    }).as('getStudents');

    cy.intercept('DELETE', '/api/students/2', {
        statusCode: 204,
        body: {},
    }).as('deleteStudent2');

    cy.visit('/students');

    // 1er chargement
    cy.wait('@getStudents');

    cy.contains('Bob')
        .parent() // <tr> ou <div> parent de la ligne
        .within(() => {
        cy.contains('Supprimer').click();
        });

    cy.wait('@deleteStudent2');

    cy.wait('@getStudents');

    cy.contains('Bob').should('not.exist');
    });

});
