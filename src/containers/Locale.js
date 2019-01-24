import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getMemberData from '../actions/member';
import {getCurrentHistory, getLastHistory} from '../actions/histories';

class Locale extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    histories: PropTypes.shape({}),
    fetchData: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
  }
  static defaultProps = {
    match: null,
  }

  componentDidMount = () => {
    const { fetchData } = this.props;
    fetchData();
    this.fetchHistory();
    this.LastHistory();
  }


  /**
    * Fetch Data from API, saving to Redux
    */
   fetchHistory = () => {
    const { fetchData, showError } = this.props;
    return fetchData()
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }
  /**
    * Fetch Data from API, saving to Redux
    */
   LastHistory = () => {
    const { fetchLastData } = this.props;
    return fetchLastData()
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }


  render = () => {
    const { Layout, histories, match, member, last_history } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return <Layout histories={histories} historyId={id} member={member} last_history={last_history  ? last_history : ''} />;
  }
}

const mapStateToProps = state => {
  return {
    histories: state.histories,
    member: state.member,
    last_history: state.last_history,
  }
};

const mapDispatchToProps = {
  fetchData: getCurrentHistory,
  fetchLastData: getLastHistory,
  fetchMember: getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Locale);
