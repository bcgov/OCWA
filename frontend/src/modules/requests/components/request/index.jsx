import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Date from '@src/components/date';
import isEmpty from 'lodash/isEmpty';
import { NavLink, Route, Switch } from 'react-router-dom';
import Discussion from '@src/modules/discussion/containers/discussion';

import InfoIcon from '@atlaskit/icon/glyph/info';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import Details from './details';
import StateLabel from '../state-label';
import Sidebar from '../../containers/sidebar';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

function Request({ data, isLoaded, updatedAt, match }) {
  if (!isLoaded && isEmpty(data)) {
    return null;
  }

  return (
    <div id="requests-page">
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
                  className={styles.tab}
                  activeClassName={styles.tabActive}
                  to={match.url}
                >
                  <InfoIcon size="small" />
                  {' Details'}
                </NavLink>
                <NavLink
                  exact
                  className={styles.tab}
                  activeClassName={styles.tabActive}
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
                  render={() => <Discussion id={data.topic} />}
                />
              </Switch>
            </GridColumn>
            <GridColumn medium={3}>
              <Sidebar data={data} />
            </GridColumn>
          </Grid>
        </div>
      </Page>
    </div>
  );
}

Request.propTypes = {
  data: RequestSchema.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  updatedAt: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
};

export default Request;
