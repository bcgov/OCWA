import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Textfield from '@atlaskit/textfield';
import * as styles from '@src/modules/requests/components/search/styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      value: '',
    };
  }

  onSubmit = event => {
    const { onChange } = this.props;
    const { value } = this.input.current.value;
    event.preventDefault();
    onChange(value);
  };

  onChange = event => {
    const { onChange } = this.props;
    const { value } = event.target;
    this.setState({
      value,
    });

    onChange(value);
  };

  onClear = event => {
    const { onChange } = this.props;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      value: '',
    });
    onChange('');
  };

  render() {
    const { placeholder } = this.props;
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
          placeholder={placeholder}
          onChange={this.onChange}
          value={value}
        />
      </form>
    );
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Search.defaultProps = {
  placeholder: 'Search Requests',
};

export default Search;
