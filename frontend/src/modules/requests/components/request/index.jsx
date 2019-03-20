import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Date from '@src/components/date';
import isEmpty from 'lodash/isEmpty';
import { NavLink, Route, Switch } from 'react-router-dom';
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

function Request({ data, isLoaded, isOutputChecker, updatedAt, match }) {
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
              <h1 id="request-title">{data.name}</h1>
              <p id="request-header-details">
                {'Updated '}
                <Date value={updatedAt} format="HH:MM on MMMM Do, YYYY" />
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
                  render={() => <Details data={data} />}
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
              <Sidebar data={data} isOutputChecker={isOutputChecker} />
            </GridColumn>
          </Grid>
        </div>
      </Page>
    </div>
  );
}

Request.propTypes = {
  data: RequestSchema.isRequired,
  isOutputChecker: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  updatedAt: PropTypes.string.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Request;
