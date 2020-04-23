import React from "react";
import PropTypes from "prop-types";
import { Link, useHistory, matchPath, useLocation } from "react-router-dom";
// import axios from "axios";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import matchSorter from "match-sorter";
import { Search, Accordion, AccordionItem, OverflowMenu, Checkbox } from "@boomerang/carbon-addons-boomerang-react";
import AddTaskTemplate from "./AddTaskTemplate";
import { appLink } from "Config/appConfig";
import { Bee16, ViewOff16, SettingsAdjust20 } from "@carbon/icons-react";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import { TaskTemplateStatus } from "Constants/taskTemplateStatuses";
import styles from "./sideInfo.module.scss";

SideInfo.propTypes = {
  tasks: PropTypes.array.isRequired,
  addTemplateInState: PropTypes.func.isRequired,
};
const description = "Create and import tasks to add to the Flow Editor task list";

export function SideInfo({ taskTemplates, addTemplateInState }) {
  const [searchQuery, setSearchQuery] = React.useState();
  // const [ activeFilters, setActiveFilters ] = React.useState([]);
  const [tasksToDisplay, setTasksToDisplay] = React.useState(
    taskTemplates.filter((task) => task.status === TaskTemplateStatus.Active)
  );
  const [openCategories, setOpenCategories] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  // const Image = taskTemplateIcons[0].src;
  // const getFilterType = taskTemplates.map(task => taskTemplates.)
  // const testFilters = [
  //     {id: taskTemplateIcons[0].name,
  //       labelText: (
  //         <div className={styles.checkboxOption}>
  //           <Image /> <p>{taskTemplateIcons[0].label}</p>{" "}
  //         </div>)},
  //         {id: taskTemplateIcons[1].name,
  //       labelText: (
  //         <div className={styles.checkboxOption}>
  //           <Image /> <p>{taskTemplateIcons[1].label}</p>{" "}
  //         </div>)}
  //   ]

  const history = useHistory();
  const location = useLocation();
  const globalMatch = matchPath(location.pathname, { path: "/task-templates/:taskTemplateId/:version" });

  let categories = tasksToDisplay.reduce((acc, task) => {
    const newCategory = !acc.find((category) => task.category.toLowerCase() === category?.toLowerCase());
    if (newCategory) acc.push(capitalize(task.category));
    return acc;
  }, []);

  React.useEffect(() => {
    const newTaskTemplates = showArchived
      ? taskTemplates
      : taskTemplates.filter((task) => task.status === TaskTemplateStatus.Active);
    setSearchQuery("");
    setTasksToDisplay(newTaskTemplates);
  }, [taskTemplates, showArchived]);

  const tasksByCategory = categories.map((category) => ({
    name: category,
    tasks: tasksToDisplay.filter((task) => capitalize(task.category) === category),
  }));

  const handleOnSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTasksToDisplay(matchSorter(taskTemplates, searchQuery, { keys: ["category", "name"] }));
  };

  const handleClearFilters = () => {
    setShowArchived(false);
    // setActiveFilters([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task manager</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.tasksContainer}>
        <div className={styles.addTaskContainer}>
          <p className={styles.existingTasks}>{`Existing Tasks (${taskTemplates.length})`}</p>
          <AddTaskTemplate
            addTemplateInState={addTemplateInState}
            taskTemplates={taskTemplates}
            history={history}
            location={location}
          />
        </div>
        <section className={styles.tools}>
          <Search
            small
            labelText="Search for a task"
            onChange={handleOnSearchInputChange}
            placeHolderText="Search for a task"
            value={searchQuery}
          />
          <OverflowMenu
            renderIcon={SettingsAdjust20}
            style={{ backgroundColor: showArchived ? "#3DDBD9" : "initial", borderRadius: "0.25rem" }}
            flipped={true}
            menuOptionsClass={styles.filters}
          >
            <section className={styles.filterHeader}>
              <p className={styles.filterTitle}>Filters</p>
              <button className={styles.resetFilter} onClick={handleClearFilters}>
                Reset filters
              </button>
            </section>
            <section className={styles.filter}>
              <Checkbox
                id="archived-tasks"
                labelText="Show Archived Tasks"
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
              />
            </section>
            {/* <section className={styles.filter}>
            <p className={styles.sectionTitle}>Filter by Task Type</p>
            <CheckboxList
              initialSelectedItems={[]}
              options={testFilters}
              onChange={(...args) => this.handleCheckboxListChange(...args)}
            />
          </section> */}
          </OverflowMenu>
        </section>
        <div className={styles.tasksInfo}>
          <p className={styles.info}>{`Showing ${tasksToDisplay.length} tasks`}</p>
          <button
            addTemplateInState={addTemplateInState}
            className={styles.expandCollapse}
            onClick={() => setOpenCategories(!openCategories)}
          >
            {openCategories ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>
      <Accordion>
        {tasksByCategory.map((category) => {
          return (
            <AccordionItem
              title={`${category.name} (${category.tasks.length})`}
              open={openCategories}
              key={category.name}
            >
              {category.tasks.map((task) => (
                <Task task={task} isActive={globalMatch?.params?.taskTemplateId === task.id} />
              ))}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
function Task(props) {
  const { task } = props;
  const taskIcon = taskTemplateIcons.find((icon) => icon.name === task.revisions[task.revisions.length - 1].image);
  const isActive = task.status === TaskTemplateStatus.Active;

  return (
    <Link
      className={cx(styles.task, { [styles.active]: props.isActive })}
      to={appLink.taskTemplateEdit({ id: task.id, version: task.currentVersion })}
    >
      {taskIcon ? <taskIcon.src style={{ width: "1rem", height: "1rem" }} /> : <Bee16 />}
      <p className={cx(styles.taskName, { [styles.active]: props.isActive })}>{task.name}</p>
      {!isActive && <ViewOff16 style={{ marginLeft: "auto" }} />}
    </Link>
  );
}

export default SideInfo;