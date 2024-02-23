import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";
  it("Should delete issue, POM method", () => {
    IssueModal.getIssueDetailModal("issueTitle");
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(
      "This is an issue of type: Task."
    );
  });

  it.only("Should cancel deletion process, POM method", () => {
    IssueModal.getIssueDetailModal("issueTitle");
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    cy.get('[data-testid="modal:confirmation-dialog"]').should("not.exist");
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard("This is an issue of type: Task.");
  });
});
