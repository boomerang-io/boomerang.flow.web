import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import StepSideInfo from "./index";

const step = {
  taskName: "test",
  flowTaskStatus: "completed",
  startTime: 1540912389131,
  duration: 2178
};
const task = {
  taskName: "test task"
};

describe("StepSideInfo --- Snapshot", () => {
  it("Capturing Snapshot of StepSideInfo", () => {
    const renderedValue = renderer.create(<StepSideInfo step={step} task={task} />);
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("StepSideInfo --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<StepSideInfo step={step} task={task} />);
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
