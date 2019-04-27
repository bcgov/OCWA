import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Date from '@src/components/date';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { NavLink, Route, Switch } from 'react-router-dom';
import merge from 'lodash/merge';
import Lozenge from '@atlaskit/lozenge';
import Discussion from '@src/modules/discussion/containers/discussion';
import Spinner from '@atlaskit/spinner';
import Title from '@src/components/title';

import InfoIcon from '@atlaskit/icon/glyph/info';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import Details from './details';
import StateLabel from '../state-label';
import Sidebar from '../../containers/sidebar';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

class Request extends React.Component {
  state = {
    isEditing: get(this, 'props.location.state.isEditing', false),
  };

  componentDidUpdate(prevProps, prevState) {
    const { data, onFinishEditing } = this.props;
    const { isEditing } = this.state;

    if (prevState.isEditing && !isEditing) {
      onFinishEditing(data._id);
    }
  }

  componentWillUnmount() {
    this.props.onReset();
  }

  onEdit = () => {
    this.setState(state => ({
      isEditing: !state.isEditing,
    }));
  };

  onSave = updatedData => {
    const { data, location, onSave } = this.props;
    const duplicateFiles = get(location, 'state.duplicateFiles');

    onSave(merge({}, data, updatedData, duplicateFiles), { id: data._id });
  };

  render() {
    const {
      data,
      isLoaded,
      isOutputChecker,
      location,
      updatedAt,
      match,
    } = this.props;
    const { isEditing } = this.state;
    const duplicateFiles = get(location, 'state.duplicateFiles');
    const title = data.name || 'Loading...';

    if (!isLoaded && isEmpty(data)) {
      return null;
    }

    return (
      <div id="requests-page">
        <Title>{title}</Title>
        <Page>
          <header className={styles.header}>
            <Grid>
              <GridColumn medium={9}>
                <h1 id="request-title">
                  <span>{data.name}</span>
                  {isEditing && (
                    <Lozenge appearance="inprogress">Editing</Lozenge>
                  )}
                </h1>
                <p id="request-header-details">
                  {'Updated at '}
                  <Date value={updatedAt} format="HH:MMa on MMMM Do, YYYY" />
                </p>
              </GridColumn>
              <GridColumn medium={3}>
                <div id="request-status" style={{ textAlign: 'right' }}>
                  <StateLabel value={data.state} />
                </div>
              </GridColumn>
            </Grid>
            <Grid>
              <GridColumn>
                <nav className={styles.tabs}>
                  <NavLink
                    exact
                    activeClassName={styles.tabActive}
                    className={styles.tab}
                    id="request-details-tab"
                    to={match.url}
                  >
                    <InfoIcon size="small" />
                    {' Details'}
                  </NavLink>
                  <NavLink
                    exact
                    disabled={isEditing}
                    activeClassName={styles.tabActive}
                    className={styles.tab}
                    id="request-discussion-tab"
                    to={`${match.url}/discussion`}
                  >
                    <CommentIcon size="small" />
                    {' Discussion'}
                  </NavLink>
                </nav>
              </GridColumn>
            </Grid>
          </header>
          <div id="request-details" className={styles.main}>
            <Grid>
              <GridColumn medium={9}>
                <Switch>
                  <Route
                    exact
                    path={match.url}
                    render={() => (
                      <Details
                        data={data}
                        duplicateFiles={duplicateFiles}
                        isEditing={isEditing}
                        onSave={this.onSave}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={`${match.url}/discussion`}
                    render={() =>
                      data.topic ? (
                        <Discussion id={data.topic} title={title} />
                      ) : (
                        <Spinner />
                      )
                    }
                  />
                </Switch>
              </GridColumn>
              <GridColumn medium={3}>
                <Sidebar
                  data={data}
                  isEditing={isEditing}
                  isOutputChecker={isOutputChecker}
                  onEdit={this.onEdit}
                />
              </GridColumn>
            </Grid>
          </div>
        </Page>
      </div>
    );
  }
}

Request.propTypes = {
  data: RequestSchema.isRequired,
  isOutputChecker: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      duplicateFiles: PropTypes.shape({
        files: PropTypes.arrayOf(PropTypes.string),
        supportingFiles: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  }).isRequired,
  updatedAt: PropTypes.string.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  onFinishEditing: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Request;
