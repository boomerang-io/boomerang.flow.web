import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "../reducer";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "../../../config/servicesConfig";
import BodyWidget from "../components/BodyWidget";
import "./styles.scss";

class BodyWidgetContainer extends Component {
  static propTypes = {
    taskActions: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.taskActions.fetchTasks(`${BASE_SERVICE_URL}/tasks`);
  }

  componentWillUnmount() {
    const { taskActions } = this.props;
    if (taskActions.isFetching) {
      taskActions.cancelFetchPosts();
    }
  }

  render() {
    const { tasks } = this.props;
    if (tasks.isFetching) {
      return "...";
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return <BodyWidget tasks={tasks} app={this.props.app} />;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyWidgetContainer);