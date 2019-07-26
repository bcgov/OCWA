import * as React from 'react';
import PropTypes from 'prop-types';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import Date from '@src/components/date';
import Discussion from '@src/modules/discussion/containers/discussion';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import ExportTypeIcon from '@src/components/export-type-icon';
import InfoIcon from '@atlaskit/icon/glyph/info';
import isEmpty from 'lodash/isEmpty';
import { Link, Route, Switch } from 'react-router-dom';
import { List } from 'react-content-loader';
import Tab from '@src/components/tabs/tab';
import Tabs from '@src/components/tabs';
import { RequestSchema } from '@src/modules/requests/types';
import RequestType from '@src/modules/requests/components/request/request-type';
import Spinner from '@atlaskit/spinner';
import StateLabel from '@src/modules/requests/components/state-label';
import Title from '@src/components/title';
import { colors } from '@atlaskit/theme';

import Details from './details';
import Files from './files';
import RequestsNav from '../../containers/requests-nav';
import Sidebar from '../../containers/sidebar';
import * as styles from './styles.css';

function Request({ data, isSaving, match, submittedAt }) {
  const { requestId } = match.params;
  const title = data.name || 'Loading...';

  return (
    <div className={styles.container}>
      <Title>{title}</Title>
      <RequestsNav activeId={requestId} />
      <div className={styles.request}>
        <header className={styles.header}>
          <hgroup className={styles.hgroup}>
            <div>
              <Link to="/">&laquo; Back to Dashboard</Link>
              <h2 id="request-name-text">
                <ExportTypeIcon large exportType={data.exportType} />
                {data.name || 'Loading...'}
              </h2>
              <p
                id="request-header-details"
                className={styles.requestDetailsText}
              >
                <RequestType type={data.type} />
                <span>
                  <CalendarIcon size="small" primaryColor={colors.DN300} />
                </span>
                {'Submitted at '}
                <Date value={submittedAt} format="HH:MMa on MMMM Do, YYYY" />
              </p>
            </div>
            <StateLabel value={data.state} />
          </hgroup>
          <Tabs>
            <Tab icon={<InfoIcon />} text="Details" url={match.url} />
            {data.exportType !== 'code' && (
              <Tab
                icon={<DocumentsIcon />}
                text="Files"
                url={`${match.url}/files`}
              />
            )}
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
                render={() => <Files data={data} title={title} />}
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
  submittedAt: PropTypes.string.isRequired,
};

export default Request;
