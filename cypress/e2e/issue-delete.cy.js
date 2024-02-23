const issueTitle = "This is an issue of type: Task.";
describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should delete issue", () => {
    const expectedNumberOfIssuesAfterDeletion = 3;

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Delete issue").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("not.exist");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        expectedNumberOfIssuesAfterDeletion
      );
    });
  });
  it("Should initiate issue deletion, then cancel it", () => {
    const expectedNumberOfIssuesAfterDeletion = 4;
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Cancel").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("exist");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        expectedNumberOfIssuesAfterDeletion
      );
    });
  });
});

// Reuse the same beforeEach() block.
// Assert the visibility of the issue detail view modal.
// Click the Delete Issue button.
// Cancel the deletion in the confirmation pop-up.
// Assert that the deletion confirmation dialogue is not visible.
// Assert that the issue is not deleted and is still displayed on the Jira board.
