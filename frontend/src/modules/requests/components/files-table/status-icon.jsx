import * as React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import has from 'lodash/has';
import InlineDialog from '@atlaskit/inline-dialog';
import { colors } from '@atlaskit/theme';
import { uid } from 'react-uid';

import { FileStatusSchema } from '../../types';
import * as styles from './styles.css';

class StatusIcon extends React.Component {
  state = {
    open: false,
  };

  renderContent = () => {
    const { data } = this.props;
    return data.map(d => {
      let element = null;

      if (d.pass) {
        element = <CheckCircleIcon primaryColor={colors.G500} size="small" />;
      }

      if (has(d, 'error') || (!d.pass && d.mandatory)) {
        element = <ErrorIcon primaryColor={colors.R500} size="small" />;
      }

      if (!d.pass && !d.mandatory) {
        element = <EditorWarningIcon primaryColor={colors.Y500} size="small" />;
      }

      return (
        <div key={uid(d)} className={styles.statusRow}>
          {element} {d.name || d.error}
        </div>
      );
    });
  };

  renderIcon = () => {
    const { data } = this.props;
    const mandatoryRules = data.filter(d => d.mandatory);
    const nonMandatoryRules = data.filter(d => !d.mandatory);
    const hasError = mandatoryRules.some(d => !d.pass);
    const hasWarning = nonMandatoryRules.some(d => !d.pass);
    const isPassing = data.length > 0 && !hasError && !hasWarning;
    const label = 'Click to view file status';
    let className = 'file-table-item-';
    let element = null;

    if (isPassing) {
      className += 'passing-icon';
      element = <CheckCircleIcon primaryColor={colors.G500} label={label} />;
    } else if (hasError || has(data, '[0].error')) {
      className += 'error-icon';
      element = <ErrorIcon primaryColor={colors.R500} label={label} />;
    } else if (hasWarning) {
      className += 'warning-icon';
      element = <EditorWarningIcon primaryColor={colors.Y500} label={label} />;
    } else {
      className += 'processing-icon';
      element = <EmojiFrequentIcon primaryColor={colors.N70} label={label} />;
    }

    return <span className={className}>{element}</span>;
  };

  onOpen = () => {
    const { data } = this.props;
    if (data.length > 0) {
      this.setState({
        open: true,
      });
    }
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open } = this.state;
    const iconElement = this.renderIcon();

    return (
      <InlineDialog
        onClose={this.onClose}
        content={this.renderContent()}
        isOpen={open}
      >
        <div
          className="file-upload-status-icon"
          role="button"
          onClick={this.onOpen}
        >
          {iconElement}
        </div>
      </InlineDialog>
    );
  }
}

StatusIcon.propTypes = {
  data: PropTypes.arrayOf(FileStatusSchema),
};

StatusIcon.defaultProps = {
  data: [],
};

export default StatusIcon;
