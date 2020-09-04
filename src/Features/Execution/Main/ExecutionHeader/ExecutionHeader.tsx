import React from "react";
import { Link, useHistory } from "react-router-dom";
import { SkeletonPlaceholder } from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import FeatureHeader from "Components/FeatureHeader";
import moment from "moment";
import { QueryStatus } from "Constants";
import { WorkflowSummary, WorkflowDetailedActivityExecution } from "Types";
import styles from "./executionHeader.module.scss";

interface HeaderProps {
  workflow: {
    data: WorkflowSummary;
    status: string;
    error: any;
  };
  workflowExecution: {
    data: WorkflowDetailedActivityExecution;
    status: string;
    error: any;
  };
}

const ExecutionHeader: React.FC<HeaderProps> = ({ workflow, workflowExecution }) => {
  const history = useHistory();
  const { state } = history.location;

  const { teamName, initiatedByUserName, trigger, creationDate } = workflowExecution.data;

  //@ts-ignore
  const fromUrl = state ? state.fromUrl : appLink.activity();
  //@ts-ignore
  const fromText = state ? state.fromText : "Activity";

  return (
    <FeatureHeader includeBorder>
      <div className={styles.container}>
        <section>
          <div className={styles.subtitle}>
            <Link className={styles.activityLink} to={fromUrl}>
              {fromText}
            </Link>
            <p style={{ margin: "0 0.5rem" }}>/</p>
            {!workflow?.data?.name ? (
              <SkeletonPlaceholder className={styles.workflowNameSkeleton} />
            ) : (
              <p>{workflow.data.name}</p>
            )}
          </div>
          <h1 className={styles.title}>Workflow run detail</h1>
        </section>
        {workflowExecution.status === QueryStatus.Success ? (
          <div className={styles.content}>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Team</dt>
              <dd className={styles.dataValue}>{teamName}</dd>
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Initiated by</dt>
              {initiatedByUserName ? (
                <dd className={styles.dataValue}>{initiatedByUserName}</dd>
              ) : (
                <dd aria-label="robot" aria-hidden={false} role="img">
                  {"🤖"}
                </dd>
              )}
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Trigger</dt>
              <dd className={styles.dataValue}>{trigger}</dd>
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Start time</dt>
              <dd className={styles.dataValue}>{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</dd>
            </dl>
          </div>
        ) : (
          <SkeletonPlaceholder className={styles.headerContentSkeleton} />
        )}
      </div>
    </FeatureHeader>
  );
};

export default ExecutionHeader;
