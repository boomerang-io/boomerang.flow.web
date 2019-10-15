import React from "react";
import ExecutionHeader from "./index";

const props = {
  workflowExecutionData: {
    teamName: "CAI Offerings",
    initiatedByUserName: "Tim Bula",
    trigger: "manual",
    creationDate: "2019-09-03T15:00:00.049+0000"
  },
  workflow: {
    name: "Sparkle Flow with extra glitter and donuts on the side"
  }
};

describe("ExecutionHeader --- Snapshot", () => {
  it("Capturing Snapshot of ExecutionHeader", () => {
    const { baseElement } = rtlRouterRender(<ExecutionHeader {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
