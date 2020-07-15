import React from "react";
import { ExecutionContext } from "State/context";
import { useQuery } from "Hooks";
import { useParams } from "react-router-dom";
import { Loading, Error } from "@boomerang-io/carbon-addons-boomerang-react";
import Main from "./Main";
import { serviceUrl } from "Config/servicesConfig";

const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

export default function ExecutionContainer() {
  const { workflowId, executionId } = useParams();
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId });
  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const summaryQuery = useQuery(getSummaryUrl);
  const executionQuery = useQuery(getExecutionUrl, {
    refetchInterval: 5000,
  });
  const { data: revisionData, error: revisionError, isLoading: revisionIsLoading } = useQuery(getRevisionUrl);
  const { data: taskTemplatesData, error: taskTemplatesError, isLoading: taskTempaltesAreLoading } = useQuery(getTaskTemplatesUrl);

  // const revisionQuery = useQuery(getRevisionUrl);
  // const taskTemplatesQuery = useQuery(getTaskTemplatesUrl);
  // const executionQuery = useQuery(getExecutionUrl, {
  //   refetchInterval: 5000,
  // });

  if (taskTempaltesAreLoading || revisionIsLoading || summaryQuery.isLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || revisionError || taskTemplatesError || executionQuery.error) {
    return <Error />;
  }

  if (revisionData && taskTemplatesData && executionQuery.data) {
    return (
      <ExecutionContext.Provider
        value={{
          tasks: taskTemplatesData,
          workflowExecution: executionQuery.data,
          workflowRevision: revisionData,
        }}
      >
        <Main dag={revisionData.dag} workflow={summaryQuery} workflowExecution={executionQuery} />
      </ExecutionContext.Provider>
    );
  }

  return null;
}
