import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import fileDownload from "js-file-download";
import { Button, OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import {
  notify,
  ToastNotification,
  ModalFlow,
  ConfirmModal,
  TooltipIcon,
} from "@boomerang/carbon-addons-boomerang-react";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import WorkflowInputModalContent from "./WorkflowInputModalContent";
import WorkflowRunModalContent from "./WorkflowRunModalContent";
import UpdateWorkflow from "./UpdateWorkflow";
import imgs from "Assets/icons";
import { Run20 } from "@carbon/icons-react";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import styles from "./workflowCard.module.scss";

class WorkflowCard extends Component {
  static propTypes = {
    deleteWorkflow: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setActiveTeam: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    workflow: PropTypes.object.isRequired,
  };

  state = {
    isDeleteModalOpen: false,
    isUpdateWorkflowModalOpen: false,
  };

  componentWillUnmount() {
    this.handleOverflowMenuClose();
  }

  executeWorkflow = ({ redirect, properties }) => {
    this.props.executeWorkflow({
      workflowId: this.props.workflow.id,
      redirect,
      properties,
    });
  };

  /**
   * Format properties to be edited in form by Formik. It doesn't work with property notation :(
   * See: https://jaredpalmer.com/formik/docs/guides/arrays#nested-objects
   * This is safe to do because we don't accept "-" characters in property keys
   * @returns {Array}
   */
  formatPropertiesForEdit = () => {
    const { properties = [] } = this.props.workflow;
    return properties.filter((property) => !property.readOnly);
  };

  handleExportWorkflow = (workflow) => {
    notify(<ToastNotification kind="info" title="Export Workflow" subtitle="Your download will start soon." />);
    axios
      .get(`${BASE_SERVICE_URL}/workflow/export/${workflow.id}`)
      .then((res) => {
        const status = res.status.toString();
        if (status.startsWith("4") || status.startsWith("5"))
          notify(<ToastNotification kind="error" title="Export Workflow" subtitle="Something went wrong." />);
        else fileDownload(JSON.stringify(res.data, null, 4), `${workflow.name}.json`);
      })
      .catch((error) => {
        notify(<ToastNotification kind="error" title="Export Workflow" subtitle="Something went wrong." />);
      });
  };

  setActiveTeam = () => {
    const { setActiveTeam, teamId } = this.props;
    setActiveTeam(teamId);
  };

  setActiveTeamAndRedirect = () => {
    const { history, workflow } = this.props;
    this.setActiveTeam();
    history.push(`/editor/${workflow.id}/designer`);
  };

  /* prevent page scroll when up or down arrows are pressed **/
  preventKeyScrolling = (e) => {
    if ([38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  };

  handleOverflowMenuOpen = () => {
    window.addEventListener("keydown", this.preventKeyScrolling, false);
  };

  handleOverflowMenuClose = () => {
    window.removeEventListener("keydown", this.preventKeyScrolling, false);
  };

  render() {
    const { deleteWorkflow, fetchTeams, history, teamId, workflow } = this.props;
    const menuOptions = [
      {
        itemText: "Edit Workflow",
        onClick: this.setActiveTeamAndRedirect,
        primaryFocus: true,
      },
      {
        itemText: "View Activity",
        onClick: () => history.push(`/activity?page=0&size=10&workflowIds=${workflow.id}`),
      },

      {
        itemText: "Export .json",
        onClick: () => this.handleExportWorkflow(workflow),
      },
      {
        itemText: "Update .json",
        onClick: () => this.setState({ isUpdateWorkflowModalOpen: true }),
      },
      {
        hasDivider: true,
        itemText: "Delete",
        isDelete: true,
        onClick: () => this.setState({ isDeleteModalOpen: true }),
      },
    ];

    const formattedProperties = this.formatPropertiesForEdit();

    return (
      <div className={styles.container}>
        <Link to={`/editor/${workflow.id}/designer`} onClick={this.setActiveTeam}>
          <section className={styles.cardInfo}>
            <div className={styles.cardIconContainer}>
              <img className={styles.cardIcon} src={imgs[workflow.icon ? workflow.icon : "docs"]} alt="icon" />
            </div>
            <div className={styles.cardDescriptionContainer}>
              <h2 className={styles.cardName}>{workflow.name}</h2>
              <p className={styles.cardDescription}>{workflow.shortDescription}</p>
            </div>
          </section>
        </Link>
        <section className={styles.cardLaunch}>
          {Array.isArray(formattedProperties) && formattedProperties.length !== 0 ? (
            <ModalFlow
              modalHeaderProps={{
                title: "Workflow Properties",
                subtitle: "Provide property values for your workflow",
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="field" onClick={openModal}>
                  Run it
                </Button>
              )}
            >
              <WorkflowInputModalContent executeWorkflow={this.executeWorkflow} inputs={formattedProperties} />
            </ModalFlow>
          ) : (
            <ModalFlow
              composedModalProps={{ containerClassName: `${styles.executeWorkflow}` }}
              modalHeaderProps={{
                title: "Execute Workflow?",
                subtitle: '"Run and View" will navigate you to the workflow exeuction view.',
              }}
              modalTrigger={({ openModal }) => (
                <Button iconDescription="Run Workflow" renderIcon={Run20} size="field" onClick={openModal}>
                  Run it
                </Button>
              )}
            >
              <WorkflowRunModalContent executeWorkflow={this.executeWorkflow} />
            </ModalFlow>
          )}
        </section>
        {workflow.templateUpgradesAvailable && (
          <div className={styles.templatesWarningIcon}>
            <TooltipIcon
              direction="top"
              tooltipText={"New version of a task available! To update, edit your workflow."}
            >
              <WorkflowWarningButton />
            </TooltipIcon>
          </div>
        )}
        <OverflowMenu
          flipped
          ariaLabel="Overflow card menu"
          iconDescription="Overflow menu icon"
          onOpen={this.handleOverflowMenuOpen}
          onClose={this.handleOverflowMenuClose}
          style={{ position: "absolute", right: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
        {this.state.isUpdateWorkflowModalOpen && (
          <UpdateWorkflow
            fetchTeams={fetchTeams}
            onCloseModal={() => this.setState({ isUpdateWorkflowModalOpen: false })}
            teamId={teamId}
            workflowId={workflow.id}
          />
        )}
        {this.state.isDeleteModalOpen && (
          <ConfirmModal
            affirmativeAction={() => {
              deleteWorkflow({ teamId, workflowId: workflow.id });
            }}
            affirmativeButtonProps={{ kind: "danger" }}
            affirmativeText="Delete"
            isOpen={this.state.isDeleteModalOpen}
            negativeAction={() => {
              this.setState({ isDeleteModalOpen: false });
            }}
            negativeText="Cancel"
            onCloseModal={() => {
              this.setState({ isDeleteModalOpen: false });
            }}
            title="Delete Workflow"
          >
            Are you sure you want to delete this workflow? There's no going back from this decision.
          </ConfirmModal>
        )}
      </div>
    );
  }
}

export default withRouter(WorkflowCard);
