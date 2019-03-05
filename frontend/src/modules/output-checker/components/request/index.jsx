import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import Discussion from '@src/modules/discussion/containers/discussion';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import InfoIcon from '@atlaskit/icon/glyph/info';
import isEmpty from 'lodash/isEmpty';
import { Link, Route, Switch } from 'react-router-dom';
import { List } from 'react-content-loader';
import Tab from '@src/components/tabs/tab';
import Tabs from '@src/components/tabs';
import { RequestSchema } from '@src/modules/requests/types';
import Spinner from '@atlaskit/spinner';
import StateLabel from '@src/modules/requests/components/state-label';

import Details from './details';
import Files from './files';
import RequestsNav from '../../containers/requests-nav';
import Sidebar from '../../containers/sidebar';
import * as styles from './styles.css';

function Request({ data, isSaving, match }) {
  const { requestId } = match.params;

  return (
    <div className={styles.container}>
      <RequestsNav activeId={requestId} />
      <div className={styles.request}>
        <header className={styles.header}>
          <hgroup className={styles.hgroup}>
            <div>
              <Link to="/">&laquo; Back to Dashboard</Link>
              <h2 id="request-name-text">{data.name || 'Loading...'}</h2>
            </div>
            <StateLabel value={data.state} />
          </hgroup>
          <Tabs>
            <Tab icon={<InfoIcon />} text="Details" url={match.url} />
            <Tab
              icon={<DocumentsIcon />}
              text="Files"
              url={`${match.url}/files`}
            />
            <Tab
              icon={<CommentIcon />}
              text="Discussion"
              url={`${match.url}/discussion`}
            />
          </Tabs>
        </header>
        {isEmpty(data) && (
          <div id="request-loading" className={styles.empty}>
            <List />
          </div>
        )}
        {!isEmpty(data) && (
          <div className={styles.main}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => <Details data={data} />}
              />
              <Route
                exact
                path={`${match.url}/files`}
                render={() => <Files data={data} />}
              />
              <Route
                exact
                path={`${match.url}/discussion`}
                render={() =>
                  data.topic ? <Discussion id={data.topic} /> : <Spinner />
                }
              />
            </Switch>
            <Sidebar id={requestId} data={data} isSaving={isSaving} />
          </div>
        )}
      </div>
    </div>
  );
}

Request.propTypes = {
  data: RequestSchema.isRequired,
  isSaving: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      requestId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Request;
