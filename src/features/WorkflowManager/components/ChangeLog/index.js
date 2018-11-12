import React, { Component } from "react";
// import axios from "axios";
import PropTypes from "prop-types";
// import InfiniteScroll from 'react-infinite-scroller';
// import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import ScrollUp from "Components/ScrollUp";
import LogCard from "./LogCard";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
// import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class ChangeLog extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    changeLog: PropTypes.object.isRequired
  };

  static defaultProps = {
    workflow: {}
  };

  // state = {
  //   hasMoreLogs: !this.props.changeLog.data.last,
  //   changeLogList: this.props.changeLog.data.records
  // };

  // loadMoreLogs = (page) => {
  //   let newChangeLog = [].concat(this.state.changeLogList);
  //   axios.get(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/changelog?size=10&page=${page}`).then(response => {
  //     const { records, last } = response.data;
  //     this.setState({changeLogList: newChangeLog.concat(records), hasMoreLogs:!last});
  //   });
  // }

  render() {
    // const { hasMoreLogs, changeLogList } = this.state; 
    const { changeLog } = this.props; 
    const changeLogSorted = sortByProp(changeLog.data, "version", "desc" );

    return(
      <div className="c-worklfow-change-log">
        <label className="b-worklfow-change-log__title">{`${this.props.workflow.data.name}`}</label>
        <div className="c-worklfow__log-list">
          {
            changeLogSorted.length>0?
            // <InfiniteScroll
            //   pageStart={0}
            //   loadMore={this.loadMoreLogs}
            //   hasMore={hasMoreLogs}
            //   loader={<LoadingAnimation className="s-change-log-loading"/>}
            //   useWindow={true}
            // >              
            //   {
            //     changeLogList.map(log => {
            //       return (
            //         <LogCard log={log} />
            //       );
            //     })
            //   }      
            // </InfiniteScroll>
            
            changeLogSorted.map(log => {
              return (
                <LogCard log={log} />
              );
            })
            :
            <NoDisplay text="No changes to display" style={{marginTop:"2rem"}}/>
          }
        </div>
        <ScrollUp/>
      </div>
    );
  }
}

export default ChangeLog;
