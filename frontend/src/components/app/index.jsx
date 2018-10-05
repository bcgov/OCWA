import React from 'react';
import Button from '@atlaskit/button';
import ky from 'ky';
import Flag from '@atlaskit/flag';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import union from 'lodash/union';
import unionBy from 'lodash/unionBy';
import { akColorN40 } from '@atlaskit/util-shared-styles';
import '@atlaskit/css-reset';

import Comment from '../comment';
import Form from '../form';

const TOKEN_KEY = 'ocwa.token';

class App extends React.Component {
  static socket = null;

  state = {
    data: [],
    error: false,
    loading: false,
    token: null,
    topic: null,
  };

  componentDidMount() {
    this.checkAuth();
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  getHeaders = () => {
    const { token } = this.state;
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (isEmpty(token)) {
      try {
        const auth = await ky.get('/auth/session').json();
        if (auth.token) {
          this.saveToken(auth.token);
        } else {
          window.open('/login', '_self');
        }
      } catch (err) {
        this.setState({
          error: true,
        });
      }
    } else {
      this.saveToken(token);
    }
  };

  saveToken = token => {
    localStorage.setItem(TOKEN_KEY, token);
    this.setState(
      {
        token,
      },
      () => {
        this.openSocket();
        this.fetch();
      }
    );
  };

  fetch = async () => {
    const headers = this.getHeaders();

    this.setState({ loading: true });

    try {
      const topics = await ky.get('/v1', { headers }).json();
      const topic = head(topics); // Just for demo purposes
      const comments = await ky
        .get(`/v1/comment/${topic._id}`, { headers })
        .json();

      this.setState(state => ({
        data: unionBy(state.data, comments, '_id'),
        loading: false,
        topic,
      }));
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  openSocket = () => {
    const { token } = this.state;
    this.socket = new WebSocket(`ws://${process.env.FORUM_SOCKET}`, token);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onSocketOpen;
  };

  onSocketOpen = () => console.log('[SOCKET] connected');

  onMessage = event => {
    const json = JSON.parse(event.data);

    if (json) {
      this.setState(state => ({
        data: union(state.data, [json.comment]),
      }));
    }
  };

  onSave = async value => {
    const { topic } = this.state;
    const headers = this.getHeaders();

    this.setState({ error: false });

    try {
      await ky
        .post(`/v1/comment/${topic._id}`, {
          headers,
          json: {
            comment: value,
          },
        })
        .json();
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

  onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    this.setState({ token: null });
    window.open('/auth/logout', '_self');
  };

  render() {
    const { data, error, loading, token, topic } = this.state;
    const isAuthenticated = !isEmpty(token);

    return (
      <main>
        <Page>
          <div style={{ padding: 50 }}>
            <Grid layout="fluid">
              <GridColumn medium={2} />
              <GridColumn medium={6}>
                <h2>{loading ? 'Loading...' : get(topic, 'name', 'Topic')}</h2>
                <p style={{ marginBottom: 30 }}>
                  For demonstration purposes only. Connects to the forum API.
                </p>
              </GridColumn>
              <GridColumn medium={2}>
                <div style={{ textAlign: 'right' }}>
                  {!isAuthenticated && (
                    <Button appearance="link" href="/login">
                      Login
                    </Button>
                  )}
                  {isAuthenticated && (
                    <Button onClick={this.onLogout}>Logout</Button>
                  )}
                </div>
              </GridColumn>
            </Grid>
            <Grid layout="fluid">
              <GridColumn medium={2} />
              <GridColumn medium={8}>
                {error && (
                  <div style={{ marginBottom: 20 }}>
                    <Flag
                      appearance="error"
                      description="Please try again"
                      title="There was an error"
                    />
                  </div>
                )}
                {isAuthenticated && (
                  <React.Fragment>
                    {data.map(d => <Comment key={d._id} data={d} />)}
                    {data.length === 0 && this.renderEmpty()}
                    <Form onSave={this.onSave} />
                  </React.Fragment>
                )}
                {!isAuthenticated && <div>Nothing available</div>}
              </GridColumn>
            </Grid>
          </div>
        </Page>
      </main>
    );
  }
}

export default App;
