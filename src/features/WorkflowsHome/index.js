import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as teamsActions } from "State/teams";
import sortBy from "lodash/sortBy";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import WorkflowsSection from "./WorkflowsSection";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsHome extends Component {
  static propTypes = {
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    teamsFilter: []
  };

  componentDidMount() {
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  handleSearchFilter = (searchQuery, teams) => {
    this.setState({ searchQuery, teamsFilter: teams });
  };

  filterTeams = () => {
    const { teams } = this.props;
    const { teamsFilter } = this.state;

    if (teamsFilter.length > 0) {
      return teams.data.filter(team => teamsFilter.find(filter => filter.text === team.name));
    } else {
      return teams.data;
    }
  };

  updateWorkflows = data => {
    this.props.teamsActions.updateWorkflows(data);
  };

  setActiveTeamAndRedirect = selectedTeamId => {
    this.props.teamsActions.setActiveTeam({ teamId: selectedTeamId });
    this.props.history.push(`/creator/overview`);
  };

  render() {
    const { teams } = this.props;
    const { searchQuery } = this.state;

    if (teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (teams.isFetching) {
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <LoadingAnimation />
          </div>
        </div>
      );
    }

    if (teams.status === REQUEST_STATUSES.SUCCESS) {
      const filteredTeams = this.filterTeams();
      const sortedTeams = sortBy(filteredTeams, ["name"]);

      if (!sortedTeams.length) {
        return (
          <div className="c-workflow-home">
            <div className="c-workflow-home-content">
              <SearchFilterBar handleSearchFilter={this.handleSearchFilter} teams={teams.data} />
              <NoDisplay />
            </div>
          </div>
        );
      }
      return (
        <div className="c-workflow-home">
          <div className="c-workflow-home-content">
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} teams={teams.data} />
            {sortedTeams.map(team => {
              return (
                <WorkflowsSection
                  team={team}
                  searchQuery={searchQuery}
                  updateWorkflows={this.updateWorkflows}
                  setActiveTeamAndRedirect={this.setActiveTeamAndRedirect}
                  key={team.id}
                />
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsHome);