import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getHistories, setError } from '../actions/histories';
import { getMemberData } from '../actions/member';

class RecipeListing extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    fetchData: PropTypes.func.isRequired,
    fetchHistories: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  }

  componentDidMount = () => {
    const { fetchData } = this.props;
    fetchData();
    this.fetchHistories();
  }


  /**
    * Fetch Data from API, saving to Redux
    */
   fetchHistories = () => {
    const { fetchHistories, showError } = this.props;
    return fetchHistories()
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }

  render = () => {
    const { Layout, member, histories, match } = this.props;
    return (
      <Layout
        member={member}
        loading={histories.loading}
        histories={histories}
        reFetch={() => this.fetchHistories()}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  histories: state.histories,
});

const mapDispatchToProps = {
  fetchData: getMemberData,
  fetchHistories: getHistories,
  showError: setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
