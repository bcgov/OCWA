import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Textfield from '@atlaskit/textfield';

import * as styles from './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      value: '',
    };
  }

  onSubmit = event => {
    const { onSearch } = this.props;
    event.preventDefault();

    onSearch(this.input.current.value);
  };

  onChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  onClear = event => {
    const { onClear } = this.props;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      value: '',
    });
    onClear();
  };

  render() {
    const { value } = this.state;

    return (
      <form className={styles.container} onSubmit={this.onSubmit}>
        {value && (
          <Button
            appearance="subtle"
            className={styles.clearButton}
            onClick={this.onClear}
            spacing="compact"
          >
            <CrossCircleIcon />
          </Button>
        )}
        <Textfield
          id="requests-list-search"
          ref={this.input}
          className={styles.input}
          placeholder="Search Requests"
          onChange={this.onChange}
          value={value}
        />
      </form>
    );
  }
}

Search.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default Search;
