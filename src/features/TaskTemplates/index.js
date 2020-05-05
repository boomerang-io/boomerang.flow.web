import React from "react";
import { useQuery, queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import orderBy from "lodash/orderBy";
import ErrorDragon from "Components/ErrorDragon";
import Loading from "Components/Loading";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants/reactQueryStatuses";
import styles from "./taskTemplates.module.scss";

export function TaskTemplatesContainer() {
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const { data: taskTemplatesData, error: taskTemplatesDataError, status: taskTemplatesStatus } = useQuery({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl)
  });
  const isLoading = taskTemplatesStatus === QueryStatus.Loading;

  const addTemplateInState = newTemplate => {
    const updatedTemplatesData = [...taskTemplatesData];
    updatedTemplatesData.push(newTemplate);
    queryCache.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = updatedTemplate => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToUpdateIndex = updatedTemplatesData.findIndex(template => template.id === updatedTemplate.id);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryCache.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (taskTemplatesDataError) {
    return (
      <div className={styles.container}>
        <ErrorDragon />
      </div>
    );
  }
  if (taskTemplatesData) {
    return (
      <div className={styles.container}>
        <Sidenav taskTemplates={taskTemplatesData} addTemplateInState={addTemplateInState} />
        <Switch>
          <Route exact path={match.path}>
            <WombatMessage className={styles.wombat} message="Select a task template or create one" />
          </Route>
          <Route path={[`${match.path}/:taskTemplateId/:version`]}>
            <TaskTemplateOverview taskTemplates={taskTemplatesData} updateTemplateInState={updateTemplateInState} />
          </Route>
          <Redirect to="/task-templates" />
        </Switch>
      </div>
    );
  }
  return null;
}

export default TaskTemplatesContainer;
