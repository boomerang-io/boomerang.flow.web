import React from "react";
import PropTypes from "prop-types";
import { Button, ComposedModal } from "@boomerang/carbon-addons-boomerang-react";
import EditTaskTemplateForm from "./EditTaskTemplateForm";
import { Edit16 } from "@carbon/icons-react";
import styles from "./editTaskTemplateModal.module.scss";

EditTaskTemplateModal.propTypes = {
  isActive: PropTypes.bool,
  nodeType: PropTypes.string.isRequired,
  oldVersion: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
};

function EditTaskTemplateModal({ isActive, nodeType, oldVersion, setFieldValue, taskTemplates, values }) {
  const handleEditTaskTemplateModal = async ({ newValues }) => {
    setFieldValue("name", newValues.name);
    setFieldValue("description", newValues.description);
    setFieldValue("category", newValues.category);
    setFieldValue("arguments", newValues.arguments);
    setFieldValue("command", newValues.command);
    setFieldValue("image", newValues.image);
    setFieldValue("icon", newValues.icon.value);
  };
  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved"
      }}
      modalTrigger={({ openModal }) => (
        <Button
          renderIcon={Edit16}
          iconDescription="edit-template"
          disabled={oldVersion || !isActive}
          kind="ghost"
          size="field"
          onClick={openModal}
        />
      )}
      modalHeaderProps={{
        title: "Edit the basics"
      }}
    >
      {({ closeModal }) => (
        <EditTaskTemplateForm
          closeModal={closeModal}
          handleEditTaskTemplateModal={handleEditTaskTemplateModal}
          nodeType={nodeType}
          taskTemplates={taskTemplates}
          templateData={values}
        />
      )}
    </ComposedModal>
  );
}

export default EditTaskTemplateModal;
