import React from 'react';
import ky from 'ky';
import Flag from '@atlaskit/flag';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import '@atlaskit/css-reset';

import Comment from '../comment/index.jsx';
import Form from '../form/index.jsx';

class App extends React.Component {
  state = {
    data: [],
    error: false,
    loading: false,
  };

  componentDidMount() {
    this.fetch();
    const socket = (this.socket = new WebSocket(
      'ws://localhost:3001',
      process.env.TOKEN
    ));
    socket.onmessage = this.onMessage;
  }

  componentWillUnmount() {
    this.socket.close();
  }

  fetch = async () => {
    this.setState({ loading: true });
    const url = '/v1/comment/5ba17703c203bf001be809d';
    const json = await ky
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      })
      .json();

    console.log(json);
    this.setState({ loading: false, data: json });
  };

  onMessage = event => {
    const json = JSON.parse(event.data);
    this.setState({
      data: [...this.state.data, json],
    });
  };

  onSave = async value => {
    this.setState({
      error: false,
    });

    try {
      const json = await ky.post('/v1/comment/5ba17703c203bf001be809d', {
        json: {
          name: value,
        },
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      });
    } catch (e) {
      this.setState({
        error: true,
      });
    }
  };

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
                <p>
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
