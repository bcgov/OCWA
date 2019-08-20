import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import SectionMessage from '@atlaskit/section-message';
import ExportTypeIcon from '@src/components/export-type-icon';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import Date from '@src/components/date';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import merge from 'lodash/merge';
import LoadingDialog from '@src/components/loading-dialog';
import Lozenge from '@atlaskit/lozenge';
import Discussion from '@src/modules/discussion/containers/discussion';
import Spinner from '@atlaskit/spinner';
import Title from '@src/components/title';
import { colors } from '@atlaskit/theme';

import InfoIcon from '@atlaskit/icon/glyph/info';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import Details from './details';
import RequestType from './request-type';
import StateLabel from '../state-label';
import Sidebar from '../../containers/sidebar';
import { RequestSchema } from '../../types';
import { validCode, failedCode } from '../../utils';
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
    const { onReset } = this.props;
    onReset();
  }

  onEdit = () => {
    this.setState(state => ({
      isEditing: !state.isEditing,
    }));
  };

  onSave = updatedData => {
    const { data, onSave } = this.props;

    onSave(merge({}, data, updatedData), { id: data._id });
    this.setState({
      isEditing: false,
    });
  };

  render() {
    const {
      data,
      duplicateFiles,
      isSubmitting,
      isLoaded,
      isLoading,
      isOutputChecker,
      updatedAt,
      match,
      zone,
    } = this.props;
    const { isEditing } = this.state;
    const title = data.name || 'Loading...';
    const isDiscussionEnabled =
      (data.type === 'export' && zone === 'internal') ||
      (data.type === 'import' && zone === 'external');

    if (!isLoaded && isEmpty(data)) {
      return null;
    }

    const isCodeExport = data.exportType === 'code';
    const mergeRequestStatusCode = get(data, 'mergeRequestStatus.code');
    const showMergeRequestError =
      isCodeExport && mergeRequestStatusCode === failedCode;
    const showMergeRequestLoading =
      isCodeExport && mergeRequestStatusCode < validCode;
    const showMergeRequestComplete =
      isCodeExport && mergeRequestStatusCode === validCode;

    return (
      <div id="requests-page">
        <Title>{title}</Title>
        {isCodeExport && (
          <LoadingDialog
            open={data.autoAccept && isSubmitting}
            title="Approving Request"
            text="This can take some time, please wait for the merge request to complete"
          />
        )}
        <Page>
          <header
            className={cx(styles.header, {
              [styles.headerWithDiscussion]: isDiscussionEnabled,
            })}
          >
            <Grid>
              <GridColumn medium={9}>
                <h1 id="request-title">
                  <ExportTypeIcon large exportType={data.exportType} />
                  <span>{title}</span>
                </h1>
                <p id="request-header-details">
                  <RequestType type={data.type} />
                  <span>
                    <CalendarIcon size="small" primaryColor={colors.DN300} />
                  </span>
                  {'Updated at '}
                  <Date value={updatedAt} format="HH:MMa on MMMM Do, YYYY" />
                  {isEditing && (
                    <Lozenge appearance="inprogress">Editing</Lozenge>
                  )}
                </p>
              </GridColumn>
              <GridColumn medium={3}>
                <div id="request-status" style={{ textAlign: 'right' }}>
                  <StateLabel value={data.state} />
                </div>
              </GridColumn>
            </Grid>
            {isDiscussionEnabled && (
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
            )}
          </header>
          <div id="request-details" className={styles.main}>
            <Grid>
              <GridColumn medium={9}>
                {(showMergeRequestComplete ||
                  showMergeRequestLoading ||
                  showMergeRequestError) &&
                  !isEditing && (
                    <div className={styles.mergeRequestStatus}>
                      {showMergeRequestLoading && (
                        <SectionMessage icon={Spinner}>
                          <strong>Merge Request</strong> is in progress, please
                          wait before submitting.
                        </SectionMessage>
                      )}
                      {showMergeRequestComplete && data.state < 2 && (
                        <SectionMessage
                          appearance="confirmation"
                          icon={CheckCircleIcon}
                        >
                          <strong>Merge Request Complete</strong>. Please submit
                          your request.
                        </SectionMessage>
                      )}
                      {showMergeRequestError && (
                        <SectionMessage appearance="error">
                          {get(
                            data,
                            'mergeRequestStatus.message',
                            'There was an error.'
                          )}
                        </SectionMessage>
                      )}
                    </div>
                  )}
                <Switch>
                  <Route
                    exact
                    path={match.url}
                    render={() => (
                      <Details
                        data={data}
                        duplicateFiles={duplicateFiles}
                        isEditing={isEditing}
                        isLoaded={isLoaded}
                        isLoading={isLoading}
                        onSave={this.onSave}
                      />
                    )}
                  />
                  {!isDiscussionEnabled && (
                    <Redirect from={`${match.url}/discussion`} to={match.url} />
                  )}
                  {isDiscussionEnabled && (
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
                  )}
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
  duplicateFiles: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.string),
    supportingFiles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isOutputChecker: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      isEditing: PropTypes.bool,
    }),
  }).isRequired,
  updatedAt: PropTypes.string.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  onFinishEditing: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  zone: PropTypes.string.isRequired,
};

export default Request;
