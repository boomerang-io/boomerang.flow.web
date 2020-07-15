/* eslint-disable jest/expect-expect */
/// <reference types="Cypress" />
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

it("Loads home", () => {
  cy.visit("/");
});

it("Search Functionality", () => {
  cy.visit("/");
  cy.wait(1000);
  cy.findByText("IBM Services Engineering (1)").should("be.visible");
  cy.get("[data-testid=workflow-card-title]").should("be.visible");
  cy.get("[data-testid=workflows-team-search]").type("nonexistent flow");
  cy.findByText("IBM Services Engineering (0)").should("be.visible");
});

it("Create Flow", () => {
  cy.visit("/");
  cy.wait(1000);
  cy.get("[data-testid=workflows-create-workflow-button]").click();
  cy.findByLabelText("Workflow Name").type("testing flow");
  cy.findByLabelText("Summary").type("example summary");
  cy.findByLabelText("Description").type("example description");
  cy.get("[data-testid=workflows-create-workflow-submit]").should("be.visible").click();
  cy.wait(1000);
  cy.url().should("include", "/editor");
});
