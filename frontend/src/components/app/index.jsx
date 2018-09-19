import React from 'react';
import ky from 'ky';
import Flag from '@atlaskit/flag';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import union from 'lodash/union';
import unionBy from 'lodash/unionBy';
import { akColorN40 } from '@atlaskit/util-shared-styles';
import '@atlaskit/css-reset';

import Comment from '../comment/index.jsx';
import Form from '../form/index.jsx';
const ID = '5ba173d0c203bf001be809d7';

class App extends React.Component {
  state = {
    data: [],
    error: false,
    loading: false,
  };

  componentDidMount() {
    this.fetch();
    this.socket = new WebSocket('ws://localhost:3001', process.env.TOKEN);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onSocketOpen;
  }

  componentWillUnmount() {
    this.socket.close();
  }

  fetch = async () => {
    this.setState({ loading: true });
    const url = `/v1/comment/${ID}`;
    const json = await ky
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      })
      .json();

    this.setState({
      data: unionBy(this.state.data, json, '_id'),
      loading: false,
    });
  };

  onSocketOpen = event => {
    console.log('[SOCKET] connected');
  };

  onMessage = event => {
    const json = JSON.parse(event.data);

    if (json) {
      this.setState({
        data: union(this.state.data, [json.comment]),
      });
    }
  };

  onSave = async value => {
    this.setState({
      error: false,
    });

    try {
      const json = await ky.post(`/v1/comment/${ID}`, {
        json: {
          comment: value,
        },
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      });
      // this.fetch();
    } catch (e) {
      this.setState({
        error: true,
      });
    }
  };

  renderEmpty = () => (
    <div
      style={{
        padding: 20,
        borderRadius: 4,
        border: `1px solid ${akColorN40}`,
      }}
    >
      <h5>No comments yet</h5>
      <p>Be the first to start the discussion.</p>
    </div>
  );

  render() {
    const { data, error, loading, isExpanded } = this.state;

    return (
      <main>
        <Page>
          <div style={{ padding: 50 }}>
            <Grid layout="fluid">
              <GridColumn medium={2} />
              <GridColumn medium={8}>
                <h2>OWCA Demo</h2>
                <p style={{ marginBottom: 30 }}>
                  For demonstration purposes only. Connects to the forum API.
                </p>
              </GridColumn>
            </Grid>
            <Grid layout="fluid">
              <GridColumn medium={2} />
              <GridColumn medium={8}>
                {error && (
                  <Flag
                    appearance="error"
                    description="Please try again"
                    title="There was an error"
                  />
                )}
                {data.map(d => <Comment key={d._id} data={d} />)}
                {data.length === 0 && this.renderEmpty()}
                <Form onSave={this.onSave} />
              </GridColumn>
            </Grid>
          </div>
        </Page>
      </main>
    );
  }
}

export default App;
