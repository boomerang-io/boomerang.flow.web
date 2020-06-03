import React from "react";
import CreateEditTeamPropertiesModalContent from "../CreateEditTeamPropertiesModalContent";
import { fireEvent, waitFor } from "@testing-library/react";

const mockfn = jest.fn();
const props = {
  closeModal: mockfn,
  cancelRequestRef: { current: mockfn },
  isEdit: true,
  team: { id: "Test-Id" },
  propertyKeys: ["key"],
  property: {
    id: 1,
  },
};

describe("CreateEditTeamPropertiesModalContent --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateEditTeamPropertiesModalContent", () => {
    const { baseElement } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateEditTeamPropertiesModalContent --- RTL Tests", () => {
  test("CreateEditTeamPropertiesModalContent - test if the isActive Toggle appears", () => {
    const newProps = { ...props, isEdit: false };
    const { queryByText } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...newProps} />);

    expect(queryByText(/active/i)).not.toBeInTheDocument();
  });

  test("CreateEditTeamPropertiesModalContent - test the Submit Button state", async () => {
    const newProps = { ...props, isEdit: false };

    const { getByLabelText, findByText } = rtlContextRouterRender(
      <CreateEditTeamPropertiesModalContent {...newProps} />
    );
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);

    fireEvent.change(valueInputText, { target: { value: "Value Test" } });
    fireEvent.change(labelInputText, { target: { value: "Label Test" } });
    fireEvent.change(keyInputText, { target: { value: "Key Test" } });
    expect(await waitFor(() => findByText(/create/i))).toBeEnabled();
    await waitFor(() => {});
  });

  test("CreateEditTeamPropertiesModalContent - test if the form submits", async () => {
    const { getByLabelText, getByText } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);
    const saveButton = getByText(/save/i);

    expect(valueInputText).toBeInTheDocument();
    expect(labelInputText).toBeInTheDocument();
    expect(keyInputText).toBeInTheDocument();

    fireEvent.change(valueInputText, { target: { value: "Value Test" } });
    fireEvent.change(labelInputText, { target: { value: "Label Test" } });
    fireEvent.change(keyInputText, { target: { value: "Key Test" } });
    fireEvent.click(saveButton);
    waitFor(() => {
      expect(valueInputText).not.toBeInTheDocument();
      expect(labelInputText).not.toBeInTheDocument();
      expect(keyInputText).not.toBeInTheDocument();
    });
    await waitFor(() => {});
  });

  test("CreateEditTeamPropertiesModalContent - test form reqired validations", async () => {
    const { getByLabelText, findByText, queryByText } = rtlContextRouterRender(
      <CreateEditTeamPropertiesModalContent {...props} />
    );
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);

    expect(queryByText(/Enter a value/i)).toBeNull();
    fireEvent.change(valueInputText, { target: { value: "" } });
    fireEvent.blur(valueInputText);
    const mandatoryValueErr = await findByText(/Enter a value/i);
    expect(mandatoryValueErr).toBeInTheDocument();

    expect(queryByText(/Enter a label/i)).toBeNull();
    fireEvent.change(labelInputText, { target: { value: "" } });
    fireEvent.blur(labelInputText);
    const mandatoryLabelErr = await findByText(/Enter a label/i);
    expect(mandatoryLabelErr).toBeInTheDocument();

    expect(queryByText(/Enter a key/i)).toBeNull();
    fireEvent.change(keyInputText, { target: { value: "" } });
    fireEvent.blur(keyInputText);
    const mandatoryKeyErr = await findByText(/Enter a key/i);
    expect(mandatoryKeyErr).toBeInTheDocument();
    await waitFor(() => {});
  });
});
