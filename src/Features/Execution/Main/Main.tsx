import React, { useEffect, useRef } from "react";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import WorkflowZoom from "Components/WorkflowZoom";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { ExecutionStatus, QueryStatus, WorkflowDagEngineMode } from "Constants";
import { WorkflowSummary, WorkflowRevision, WorkflowDetailedActivityExecution } from "Types";
import styles from "./main.module.scss";

interface MainProps {
  dag: WorkflowRevision["dag"];
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

const Main: React.FC<MainProps> = ({ dag, workflow, workflowExecution }) => {
  const workflowDagEngine = new WorkflowDagEngine({
    dag,
    mode: WorkflowDagEngineMode.Executor,
  });
  const diagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    workflowDagEngine.getDiagramEngine().zoomToFit();
  }, [workflowDagEngine]);

  const { status, steps } = workflowExecution.data;

  const hasFinished = [ExecutionStatus.Completed, ExecutionStatus.Invalid, ExecutionStatus.Failure].includes(status);

  const hasStarted = steps && steps.find((step) => step.flowTaskStatus !== ExecutionStatus.NotStarted);

  const isDiagramLoading =
    workflow.status === QueryStatus.Success &&
    workflowExecution.status === QueryStatus.Success &&
    (hasStarted || hasFinished);

  const workflowDagBoundingClientRect = diagramRef.current ? diagramRef.current.getBoundingClientRect() : {};

  return (
    <div className={styles.container}>
      <ExecutionHeader workflow={workflow} workflowExecution={workflowExecution} />
      <section aria-label="Executions" className={styles.executionResultContainer}>
        <ExecutionTaskLog workflowExecution={workflowExecution} />
        <div className={styles.executionDesignerContainer} ref={diagramRef}>
          <div className={styles.executionWorkflowActions}>
            <WorkflowActions workflow={workflow.data} />
            <WorkflowZoom
              //@ts-ignore
              workflowDagBoundingClientRect={workflowDagBoundingClientRect}
              workflowDagEngine={workflowDagEngine}
            />
          </div>
          <DiagramWidget
            allowLooseLinks={false}
            allowCanvasTranslation={true}
            allowCanvasZoom={true}
            className={styles.diagram}
            deleteKeys={[]}
            diagramEngine={workflowDagEngine.getDiagramEngine()}
            maxNumberPointsPerLink={0}
          />
          {!isDiagramLoading && (
            <div className={styles.diagramLoading}>
              <Loading withOverlay={false} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Main;
