import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {getBeritas} from '../actions/beritas';

class About extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
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
    this.fetchBerita();
  }


  /**
    * Fetch Data from API, saving to Redux
    */
   fetchBerita = () => {
    const { fetchData, showError } = this.props;
    return fetchData()
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }

  render = () => {
    const { Layout, beritas, match } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return <Layout beritas={beritas['beritas']} beritaId={id} />;
  }
}

const mapStateToProps = state => ({
  beritas: state.beritas,
});

const mapDispatchToProps = {
  fetchData: getBeritas,
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
