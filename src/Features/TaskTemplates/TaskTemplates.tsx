import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "Hooks";
import { queryCache } from "react-query";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import WombatMessage from "Components/WombatMessage";
import Sidenav from "./Sidenav";
import TaskTemplateOverview from "./TaskTemplateOverview";
import orderBy from "lodash/orderBy";
import { TaskModel } from "Types";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { stringToBooleanHelper } from "Utils/stringHelper";
import styles from "./taskTemplates.module.scss";

const settingsWorkersName = "Workers";

const TaskTemplatesContainer: React.FC = () => {
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const platformSettingsUrl = serviceUrl.resourceSettings();
  const { data: taskTemplatesData, error: taskTemplatesDataError, isLoading } = useQuery(getTaskTemplatesUrl);

  const { data: settingsData, error: settingsError, isLoading: settingsIsLoading } = useQuery(platformSettingsUrl);

  const addTemplateInState = (newTemplate: TaskModel) => {
    const updatedTemplatesData = [...taskTemplatesData];
    updatedTemplatesData.push(newTemplate);
    queryCache.setQueryData(getTaskTemplatesUrl, orderBy(updatedTemplatesData, "name", "asc"));
  };
  const updateTemplateInState = (updatedTemplate: TaskModel) => {
    const updatedTemplatesData = [...taskTemplatesData];
    const templateToUpdateIndex = updatedTemplatesData.findIndex((template) => template.id === updatedTemplate.id);
    // If we found it
    if (templateToUpdateIndex !== -1) {
      updatedTemplatesData.splice(templateToUpdateIndex, 1, updatedTemplate);
      queryCache.setQueryData(getTaskTemplatesUrl, updatedTemplatesData);
    }
  };

  if (isLoading || settingsIsLoading) {
    return <Loading />;
  }

  if (taskTemplatesDataError || settingsError) {
    return (
      <div className={styles.container}>
        <ErrorDragon />
      </div>
    );
  }

  const editVerifiedTasksEnabled = stringToBooleanHelper(
    settingsData
      .find((arr: any) => arr.name === settingsWorkersName)
      ?.config?.find((setting: { key: string }) => setting.key === "enable.tasks").value ?? false
  );
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Task manager</title>
      </Helmet>
      <Sidenav taskTemplates={taskTemplatesData} addTemplateInState={addTemplateInState} />
      <Switch>
        <Route exact path={match.path}>
          <Box maxWidth="24rem" margin="0 auto">
            <WombatMessage className={styles.wombat} title="Select a task or create one" />
          </Box>
        </Route>
        <Route path={AppPath.TaskTemplateEdit}>
          <TaskTemplateOverview
            editVerifiedTasksEnabled={editVerifiedTasksEnabled}
            taskTemplates={taskTemplatesData}
            updateTemplateInState={updateTemplateInState}
          />
        </Route>
        <Redirect to={appLink.taskTemplates()} />
      </Switch>
    </div>
  );
};

export default TaskTemplatesContainer;
