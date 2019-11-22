import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorDragon from "Components/ErrorDragon";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as teamPropertiesActions } from "State/teamProperties";
import { actions as teamsActions } from "State/teams";
import Loading from "Components/Loading";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { default as USER_TYPES } from "Constants/userTypes";
import REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_TEAMS_URL, TEAMS_USER_URL, TEAM_PROPERTIES_ID_URL } from "Config/servicesConfig";
import styles from "./teamProperties.module.scss";

export class TeamProperties extends Component {
  static propTypes = {
    teamsActions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    teamPropertiesActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams = async () => {
    const { type, email } = this.props.user.data;
    try {
      if (type === USER_TYPES.ADMIN) {
        await this.props.teamsActions.fetch(BASE_TEAMS_URL);
      } else {
        await this.props.teamsActions.fetch(TEAMS_USER_URL(email));
      }
    } catch (err) {
      //noop
    }
  };

  fetchTeamProperties = team => {
    this.props.teamPropertiesActions.fetch(TEAM_PROPERTIES_ID_URL(team.id));
  };

  resetTeamProperties = () => {
    this.props.teamPropertiesActions.reset();
  };

  addTeamPropertyInStore = component => {
    return this.props.teamPropertiesActions.addTeamProperty(component);
  };

  updateTeamProperty = component => {
    return this.props.teamPropertiesActions.updateTeamProperty(component);
  };

  deleteTeamPropertyInStore = property => {
    return this.props.teamPropertiesActions.deleteTeamProperty(property);
  };

  render() {
    const { teams } = this.props;

    if (teams.isFetching) {
      return <Loading />;
    }

    if (teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (teams.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <div className={styles.container}>
          <TeamPropertiesTable
            teams={teams.data}
            addTeamPropertyInStore={this.addTeamPropertyInStore}
            updateTeamProperty={this.updateTeamProperty}
            deleteTeamPropertyInStore={this.deleteTeamPropertyInStore}
            fetchTeamProperties={this.fetchTeamProperties}
            resetTeamProperties={this.resetTeamProperties}
          />
        </div>
      );
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    teamProperties: state.teamProperties,
    teams: state.teams,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    teamsActions: bindActionCreators(teamsActions, dispatch),
    teamPropertiesActions: bindActionCreators(teamPropertiesActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamProperties);
