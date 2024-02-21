import { faker } from "@faker-js/faker";
const randomSingleWordFaker = faker.word.words(1);
const randomMultipleWordFaker = faker.word.words(3);

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("Bug");
      cy.get('input[name="title"]').should("have.value", "Bug");

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");

      // Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //MY OWN Select reporter dropdown
      cy.get('[data-testid="form-field:reporterId"]')
        .should("be.visible")
        .click();
      cy.get('[data-testid="select-option:Pickle Rick"]')
        .should("be.visible")
        .click();

      //MY OWN Select priority!
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:bug"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("Bug")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
        cy.get('[data-testid="icon:bug"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it.only("Should create a new issue using the random data plugin", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('input[name="title"]').type(randomSingleWordFaker);
      cy.get('[data-testid="form-field:description"]').type(
        randomMultipleWordFaker
      );

      cy.get('[data-testid="form-field:reporterId"]')
        .should("be.visible")
        .click();
      cy.get('[data-testid="select-option:Baby Yoda"]')
        .should("be.visible")
        .click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      cy.get('input[name="title"]').type("Task");

      cy.get('button[type="submit"]').click();

      // Assertion part
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");

      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");

      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          cy.get('[data-testid="list-issue"]')
            .should("have.length", "5")
            .first()
            .find("p")
            .contains("Bug")
            .siblings()
            .within(() => {
              cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");
              cy.get('[data-testid="icon:task"]').should("be.visible");
            });
        });

      cy.get('[data-testid="board-list:backlog"]')
        .contains("Task")
        .within(() => {
          cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");
          cy.get('[data-testid="icon:task"]').should("be.visible");
        });
    });
  });
});
