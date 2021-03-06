import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContextProvider } from "State/context";
import { AxiosResponse } from "axios";
import { History } from "history";
import { MutateOptions, MutationResult, QueryResult } from "react-query";
import { RevisionActionTypes, revisionReducer, initRevisionReducerState } from "State/reducers/workflowRevision";
import { useAppContext, useIsModalOpen, useQuery } from "Hooks";
import { useImmerReducer } from "use-immer";
import { useMutation, queryCache } from "react-query";
import { Prompt, Route, Switch, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { Loading, Error, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import Header from "./Header";
import Configure from "./Configure";
import Designer from "./Designer";
import Properties from "./Properties";
import sortBy from "lodash/sortBy";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import CustomNodeModel from "Utils/dag/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utils/dag/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utils/dag/templateTaskNode/TemplateTaskNodeModel";
import ManualApprovalNodeModel from "Utils/dag/manualApprovalNode/ManualApprovalNodeModel";
import ManualTaskNodeModel from "Utils/dag/manualTaskNode/ManualTaskNodeModel";
import SetPropertyNodeModel from "Utils/dag/setPropertyNode/setPropertyNodeModel";
import WaitNodeModel from "Utils/dag/waitNode/waitNodeModel";
import AcquireLockNodeModel from "Utils/dag/acquireLockNode/AcquireLockNodeModel";
import ReleaseLockNodeModel from "Utils/dag/releaseLockNode/ReleaseLockNodeModel";

import { serviceUrl, resolver } from "Config/servicesConfig";
import { AppPath } from "Config/appConfig";
import { NodeType, WorkflowDagEngineMode } from "Constants";
import { TaskModel, WorkflowSummary, WorkflowRevision } from "Types";
import styles from "./editor.module.scss";

export default function EditorContainer() {
  // Init revision number state is held here so we can easily refect the data on change via react-query

  const [revisionNumber, setRevisionNumber] = useState(0);
  const { workflowId } = useParams();

  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId, revisionNumber });
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const getAvailableParametersUrl = serviceUrl.getWorkflowAvailableParameters({ workflowId });

  /**
   * Queries
   */
  const summaryQuery = useQuery(getSummaryUrl);
  const revisionQuery = useQuery(getRevisionUrl, { refetchOnWindowFocus: false });
  const taskTemplatesQuery = useQuery(getTaskTemplatesUrl);

  const availableParametersQuery = useQuery(getAvailableParametersUrl);

  /**
   * Mutations
   */
  const [mutateSummary, summaryMutation] = useMutation(resolver.patchUpdateWorkflowSummary, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });
  const [mutateRevision, revisionMutation] = useMutation(resolver.postCreateWorkflowRevision, {
    onSuccess: () => {
      queryCache.invalidateQueries(serviceUrl.getTeams());
      queryCache.invalidateQueries(getSummaryUrl);
    },
  });

  // Only show loading for the summary and task templates
  // Revision takes longer and we want to show a separate loading animation for it, plus prevent remounting everything
  if (summaryQuery.isLoading || taskTemplatesQuery.isLoading || availableParametersQuery.isLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || taskTemplatesQuery.error || availableParametersQuery.error) {
    return <Error />;
  }

  // Don't block render if we don't have the revision data. We want to render the header and sidenav regardless
  // prevents unnecessary remounting when creating a new version or navigating to a previous one
  if (summaryQuery.data && taskTemplatesQuery.data && availableParametersQuery.data) {
    return (
      <EditorStateContainer
        availableParametersQueryData={availableParametersQuery.data}
        mutateRevision={mutateRevision}
        mutateSummary={mutateSummary}
        revisionMutation={revisionMutation}
        revisionQuery={revisionQuery}
        summaryData={summaryQuery.data}
        summaryMutation={summaryMutation}
        setRevisionNumber={setRevisionNumber}
        taskTemplatesData={taskTemplatesQuery.data}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

interface EditorStateContainerProps {
  availableParametersQueryData: Array<string>;
  mutateRevision: (
    variables: { workflowId: any; body: any },
    options?: MutateOptions<AxiosResponse<any>, { workflowId: any; body: any }, Error> | undefined
  ) => Promise<any>;
  mutateSummary: (
    variables: { body: any },
    options?: MutateOptions<AxiosResponse<any>, { body: any }, Error> | undefined
  ) => Promise<any>;
  revisionMutation: MutationResult<AxiosResponse<any>, Error>;
  revisionQuery: QueryResult<WorkflowRevision, Error>;
  summaryData: WorkflowSummary;
  summaryMutation: MutationResult<AxiosResponse<any>, Error>;
  setRevisionNumber: (revisionNumber: number) => void;
  taskTemplatesData: Array<TaskModel>;
  workflowId: string;
}

/**
 * Workflow Manager responsible for holding state of summary and revision
 * Make function calls to mutate server data
 */
const EditorStateContainer: React.FC<EditorStateContainerProps> = ({
  availableParametersQueryData,
  mutateRevision,
  mutateSummary,
  revisionMutation,
  revisionQuery,
  summaryData,
  summaryMutation,
  setRevisionNumber,
  taskTemplatesData,
  workflowId,
}) => {
  const location = useLocation();
  const match: { params: { workflowId: string } } = useRouteMatch();
  const { teams } = useAppContext();
  const isModalOpen = useIsModalOpen();

  const [workflowDagEngine, setWorkflowDagEngine] = useState<WorkflowDagEngine | null>(null);
  const [revisionState, revisionDispatch] = useImmerReducer(
    revisionReducer,
    initRevisionReducerState(revisionQuery.data)
  );

  // Reset the reducer state if there is new data
  useEffect(() => {
    if (revisionQuery.data) {
      revisionDispatch({
        type: RevisionActionTypes.Reset,
        data: revisionQuery.data,
      });
    }
  }, [revisionDispatch, revisionQuery.data]);

  /**
   *
   * @param {string} reason - changelog reason for new version
   * @param {function} callback - optional callback
   */
  const handleCreateRevision = useCallback(
    async ({ reason = "Update workflow", callback }) => {
      const normilzedConfig = Object.values(revisionState.config).map((config: any) => ({
        ...config,
        currentVersion: undefined,
        taskVersion: config.currentVersion || config.taskVersion,
      }));
      const revisionConfig = { nodes: Object.values(normilzedConfig) };

      const revision = {
        dag: workflowDagEngine?.getDiagramEngine().getDiagramModel().serializeDiagram(),
        config: revisionConfig,
        changelog: { reason },
      };

      try {
        const { data } = await mutateRevision({ workflowId, body: revision });
        notify(
          <ToastNotification kind="success" title="Create Version" subtitle="Successfully created workflow version" />
        );
        if (typeof callback === "function") {
          callback();
        }
        revisionDispatch({ type: RevisionActionTypes.Set, data });
        setRevisionNumber(data.version);
        queryCache.removeQueries(serviceUrl.getWorkflowRevision({ workflowId, revisionNumber: null }));
      } catch (err) {
        notify(
          <ToastNotification kind="error" title="Something's Wrong" subtitle={`Failed to create workflow version`} />
        );
      }
    },
    [mutateRevision, revisionDispatch, revisionState.config, setRevisionNumber, workflowDagEngine, workflowId]
  );

  /**
   *
   * @param {Object} formikValues - key/value pairs for inputs
   */
  const updateSummary = useCallback(
    async ({ values: formikValues, callback }) => {
      const flowTeamId = formikValues?.selectedTeam?.id;
      const updatedWorkflow = { ...summaryData, ...formikValues, flowTeamId };

      try {
        const { data } = await mutateSummary({ body: updatedWorkflow });
        queryCache.setQueryData(serviceUrl.getWorkflowSummary({ workflowId }), data);
        notify(
          <ToastNotification kind="success" title="Workflow Updated" subtitle={`Successfully updated workflow`} />
        );
        if (typeof callback === "function") {
          callback();
        }
      } catch (err) {
        notify(
          <ToastNotification
            kind="error"
            title="Something's Wrong"
            subtitle={`Failed to update workflow configuration`}
          />
        );
      }
    },
    [mutateSummary, summaryData, workflowId]
  );

  /**
   * Handle the drop event to create a new node from a task template
   * @param {Object} diagramApp - object containing the internal state of the DAG
   * @param {DragEvent} event - dragend event when adding a node to the diagram
   */
  const handleCreateNode = useCallback(
    (diagramApp, event) => {
      const { taskData } = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));

      // For naming purposes
      const nodes: Array<{ id: string; taskId: string }> = Object.values(
        diagramApp.getDiagramEngine().getDiagramModel().getNodes()
      );

      const nodesOfSameTypeCount = nodes.filter((node: any) => node.taskId === taskData.id).length;

      const nodeObj = {
        taskId: taskData.id,
        taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`,
        taskVersion: taskData.currentVersion,
      };

      // Determine the node type
      let node;
      switch (taskData.nodeType) {
        case NodeType.Decision:
          node = new SwitchNodeModel(nodeObj);
          break;
        case NodeType.TemplateTask:
          node = new TemplateNodeModel(nodeObj);
          break;
        case NodeType.CustomTask:
          node = new CustomNodeModel(nodeObj);
          break;
        case NodeType.Manual:
          node = new ManualTaskNodeModel(nodeObj);
          break;
        case NodeType.Approval:
          node = new ManualApprovalNodeModel(nodeObj);
          break;
        case NodeType.SetProperty:
          node = new SetPropertyNodeModel(nodeObj);
          break;
        case NodeType.Wait:
          node = new WaitNodeModel(nodeObj);
          break;
        case NodeType.Acquirelock:
          node = new AcquireLockNodeModel(nodeObj);
          break;
        case NodeType.Releaselock:
          node = new ReleaseLockNodeModel(nodeObj);
          break;
        default:
        // no-op
      }
      if (node) {
        const { id, taskId, currentVersion } = node;
        const currentTaskConfig =
          taskData.revisions?.find((revision: { version: number }) => revision.version === currentVersion) ?? {};

        // Create inputs object with empty string values by default for service to process easily
        const inputs =
          Array.isArray(currentTaskConfig.config) && currentTaskConfig.config.length
            ? currentTaskConfig.config.reduce((accu: { [index: string]: string }, item: { key: string }) => {
                accu[item.key] = "";
                return accu;
              }, {})
            : {};
        revisionDispatch({
          type: RevisionActionTypes.AddNode,
          data: {
            nodeId: id,
            taskId,
            inputs,
            type: taskData.nodeType,
            taskVersion: currentVersion,
          },
        });

        const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.x = points.x - 110;
        node.y = points.y - 40;
        diagramApp.getDiagramEngine().getDiagramModel().addNode(node);
      }
    },
    [revisionDispatch]
  );

  /**
   *  Simply update the parent state to use a different revision to fetch it w/ react-query
   * @param {string} revisionNumber
   */
  const handleChangeRevision = (revisionNumber: number) => {
    return setRevisionNumber(revisionNumber);
  };

  const { revisionCount } = summaryData;
  const { version } = revisionState;
  const mode = version === revisionCount ? WorkflowDagEngineMode.Editor : WorkflowDagEngineMode.Viewer;

  useEffect(() => {
    // Initial value of revisionState will be null, so need to check if its present or we get two engines created
    if (revisionState.version) {
      const newWorkflowDagEngine = new WorkflowDagEngine({ dag: revisionState.dag, mode });
      setWorkflowDagEngine(newWorkflowDagEngine);
      newWorkflowDagEngine.getDiagramEngine().repaintCanvas();
    }

    // really and truly only want to rerun this on version change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionState.version]);

  const store = useMemo(() => {
    return {
      availableParametersQueryData,
      revisionDispatch,
      revisionState,
      summaryData,
      taskTemplatesData,
    };
  }, [availableParametersQueryData, revisionDispatch, revisionState, summaryData, taskTemplatesData]);

  return (
    // Must create context to share state w/ nodes that are created by the DAG engine
    <EditorContextProvider value={store}>
      <>
        <Prompt
          when={Boolean(revisionState.hasUnsavedUpdates)}
          message={(location) =>
            //Return true to navigate if going to the same route we are currently on
            location.pathname.includes(workflowId)
              ? true
              : "Are you sure? You have unsaved changes to your workflow that will be lost."
          }
        />
        <div className={styles.container}>
          <Header
            changeRevision={handleChangeRevision}
            createRevision={handleCreateRevision}
            isOnDesigner={location.pathname.endsWith("/workflow")}
            revisionState={revisionState}
            revisionMutation={revisionMutation}
            revisionQuery={revisionQuery}
            summaryData={summaryData}
          />
          <Switch>
            <Route path={AppPath.EditorDesigner}>
              <Designer
                createNode={handleCreateNode}
                isModalOpen={isModalOpen}
                revisionQuery={revisionQuery}
                tasks={taskTemplatesData}
                workflowDagEngine={workflowDagEngine}
                workflowName={summaryData.name}
              />
            </Route>
            <Route path={AppPath.EditorProperties}>
              <Properties summaryData={summaryData} />
            </Route>
            <Route path={AppPath.EditorChangelog}>
              <ChangeLog summaryData={summaryData} />
            </Route>
            <Route
              path={AppPath.EditorConfigure}
              children={({
                history,
                match: routeMatch,
              }: {
                history: History;
                match: { params: { teamId: string; workflowId: string } };
              }) => (
                // Always render parent Configure component so state isn't lost when switching tabs
                // It is responsible for rendering its children, but Formik form management is always mounted
                <Configure
                  history={history}
                  // isOnRoute={Boolean(routeMatch)}
                  params={match.params}
                  summaryData={summaryData}
                  summaryMutation={summaryMutation}
                  teams={sortBy(teams, "name")}
                  updateSummary={updateSummary}
                />
              )}
            />
          </Switch>
          <Route
            path={AppPath.EditorConfigure}
            children={({
              history,
              match: routeMatch,
            }: {
              history: History;
              match: { params: { workflowId: string } };
            }) => (
              // Always render parent Configure component so state isn't lost when switching tabs
              // It is responsible for rendering its children, but Formik form management is always mounted
              <Configure
                history={history}
                // isOnRoute={Boolean(routeMatch)}
                params={match.params}
                summaryData={summaryData}
                summaryMutation={summaryMutation}
                teams={sortBy(teams, "name")}
                updateSummary={updateSummary}
              />
            )}
          />
        </div>
      </>
    </EditorContextProvider>
  );
};
