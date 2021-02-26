import React, { useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Formik } from "formik";
import { useAppContext, useEditorContext } from "Hooks";
import {
  AutoSuggest,
  ComboBox,
  DynamicFormik,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import styles from "./WorkflowTaskForm.module.scss";

const AutoSuggestInput = (props) => {
  //number inputs doesn't support AutoSuggest setSelectionRange
  if (props.type === "number") return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  else
    return (
      <div key={props.id}>
        <AutoSuggest
          {...props}
          initialValue={props?.initialValue !== "" ? props?.initialValue : props?.inputProps?.defaultValue}
        >
          <TextInput tooltipContent={props.tooltipContent} disabled={props?.inputProps?.readOnly} />
        </AutoSuggest>
      </div>
    );
};

const TextAreaSuggestInput = (props) => {
  //if we have a default value in the input. We want to show user it is disabled
  return (
    <div key={props.id}>
      <AutoSuggest
        {...props}
        initialValue={props?.initialValue !== "" ? props?.initialValue : props?.item?.defaultValue}
      >
        <TextArea
          tooltipContent={props.tooltipContent}
          labelText={props?.label}
          disabled={props?.item?.readOnly}
          helperText={props?.item?.helperText}
          placeholder={props?.item?.placeholder}
        />
      </AutoSuggest>
    </div>
  );
};

const TextEditorInput = (props) => {
  return <TextEditorModal {...props} {...props.item} />;
};

const TaskNameTextInput = ({ formikProps, ...otherProps }) => {
  const { errors, touched } = formikProps;
  const error = errors[otherProps.id];
  const touch = touched[otherProps.id];
  return (
    <>
      <TextInput {...otherProps} invalid={error && touch} invalidText={error} onChange={formikProps.handleChange} />
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Specifics</h2>
    </>
  );
};

/**
 * @param {parameter} inputProperties - parameter object for workflow
 * {
 *   defaultValue: String
 *   description: String
 *   key: String
 *   label: String
 *   required: Bool
 *   type: String
 * }
 */
// function formatAutoSuggestProperties(inputProperties) {
//   return inputProperties.map((parameter) => ({
//     value: `$(${parameter.key})`,
//     label: parameter.key,
//   }));
// }
function formatAutoSuggestProperties(inputProperties) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

ConfigureInputsForm.propTypes = {
  closeModal: PropTypes.func,
  inputProperties: PropTypes.array,
  node: PropTypes.object.isRequired,
  nodeConfig: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  textEditorProps: PropTypes.object,
  task: PropTypes.object.isRequired,
  taskNames: PropTypes.array.isRequired,
};

function ConfigureInputsForm(props) {
  const { teams } = useAppContext();
  const { summaryData } = useEditorContext();

  const teamWorkflows = teams.find((team) => team.id === summaryData?.flowTeamId)?.workflows;
  const teamWorkflowMapped = teamWorkflows?.map((workflow) => ({ label: workflow.name, value: workflow.id })) ?? [];

  const formikSetFieldValue = (value, id, setFieldValue) => {
    setFieldValue(id, value);
  };

  const formikHandleChange = (e, handleChange) => {
    handleChange(e);
  };

  const handleOnSave = (values) => {
    props.node.taskName = values.taskName;
    console.log(values);
    props.onSave(values);
    props.closeModal();
  };

  const textAreaProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      formikSetFieldValue: (value) => formikSetFieldValue(value, key, setFieldValue),
      onChange: (value) => formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProperties: props.inputProperties,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

  const textEditorProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      formikSetFieldValue: (value) => formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProperties: props.inputProperties,
      item: input,
      ...props.textEditorProps,
      ...itemConfig,
      ...rest,
    };
  };

  const textInputProps = ({ formikProps, input }) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      onChange: (value) => formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProps: {
        id: key,
        onBlur: handleBlur,
        invalid: touched[key] && errors[key],
        invalidText: errors[key],
        ...rest,
      },
    };
  };

  const toggleProps = ({ input, formikProps }) => {
    return {
      orientation: "vertical",
    };
  };

  const WorkflowSelectionInput = ({ formikProps, ...otherProps }) => {
    const { errors, touched, setFieldValue, values } = formikProps;
    const error = errors[otherProps.id];
    const touch = touched[otherProps.id];
    return (
      <ComboBox
        id="workflow-select"
        onChange={({ selectedItem }) => {
          setFieldValue("workflowId", selectedItem?.value ?? "");
          if (selectedItem?.value) {
            setActiveProperties(teamWorkflows.find((workflow) => workflow.id === selectedItem?.value).properties);
          }
        }}
        items={teamWorkflowMapped}
        initialSelectedItem={
          values.workflowId ? teamWorkflowMapped.find((workflow) => workflow.id === values.workflowId) : ""
        }
        titleText="Workflow"
        placeholder="Select a workflow"
        invalid={error && touch}
        invalidText={error}
      />
    );
  };

  //   const formatPropertiesForEdit = () => {
  //     const { properties = [] } = workflow;
  //     return properties.filter((property) => !property.readOnly);
  //   };

  const { node, task, taskNames, nodeConfig } = props;
  //   const taskRevisions = task?.revisions ?? [];
  // Find the matching task config for the version
  //   const taskVersionConfig = nodeConfig
  //     ? taskRevisions.find((revision) => nodeConfig.taskVersion === revision.version)?.config ?? []
  //     : [];
  const takenTaskNames = taskNames.filter((name) => name !== node.taskName);

  console.log("nodeConfig");
  console.log(nodeConfig);
  //   const [activeProperties, setActiveProperties] = useState(nodeConfig?.inputs ?? []);
  const [activeProperties, setActiveProperties] = useState([]);
  console.log("activeProperties");
  console.log(activeProperties);

  // Add the name input
  const inputs = [
    {
      key: "taskName",
      label: "Task Name",
      placeholder: "Enter a task name",
      type: "custom",
      required: true,
      customComponent: TaskNameTextInput,
    },
    {
      key: "workflowId",
      label: "Task Name",
      placeholder: "Select a workflow",
      type: "custom",
      required: true,
      customComponent: WorkflowSelectionInput,
    },
    ...activeProperties,
  ];

  const activeInputs = { workflowId: "" };
  activeProperties.forEach((prop) => {
    activeInputs[prop.key] = prop.defaultValue;
  });

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      enablereinitialize
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        workflowId: Yup.string().required("Select a workflow"),
      })}
      initialValues={{ taskName: node.taskName, ...activeInputs, ...nodeConfig.inputs }}
      inputs={inputs}
      onSubmit={handleOnSave}
      dataDrivenInputProps={{
        TextInput: AutoSuggestInput,
        TextEditor: TextEditorInput,
        TextArea: TextAreaSuggestInput,
      }}
      textAreaProps={textAreaProps}
      textEditorProps={textEditorProps}
      textInputProps={textInputProps}
      toggleProps={toggleProps}
    >
      {({ inputs, formikProps }) => (
        <ModalForm noValidate className={styles.container} onSubmit={formikProps.handleSubmit}>
          <ModalBody aria-label="inputs">{inputs}</ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formikProps.isValid}>
              Apply
            </Button>
          </ModalFooter>
        </ModalForm>
      )}
    </DynamicFormik>
  );
}

export default ConfigureInputsForm;
