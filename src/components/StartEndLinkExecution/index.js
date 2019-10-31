import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";
import styles from "./StartEndLinkExecution.module.scss";

StartEndLinkExecution.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function StartEndLinkExecution({ diagramEngine, model, path }) {
  return (
    <WorkflowLink className={styles.started} diagramEngine={diagramEngine} model={model} path={path}>
      {() => <g />}
    </WorkflowLink>
  );
}

export default StartEndLinkExecution;