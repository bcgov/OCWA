import React from 'react';
import ky from 'ky';
import '@atlaskit/css-reset';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import Comment from '../comment/index.jsx';
import Form from '../form/index.jsx';

class App extends React.Component {
  state = {
    loading: false,
    data: [],
  };

  componentDidMount() {
    // this.fetch();
  }

  /* fetch = async () => {
   *   this.setState({ loading: true });
   *   const url =  '';
   *   const json = await ky.get(url).json();

   *   this.setState({ loading: false, data: json });
   * }; */

  onSave = async value => {
    const json = await ky.post('/api/v1/comments/:topicId', {
      json: {
        user: { id: 1 },
      },
      body: value,
    });
    this.setState({
      data: [...this.state.data, json],
    });
  };

  render() {
    const { data, loading, isExpanded } = this.state;

    return (
      <main>
        <Page>
          <div style={{ padding: 50 }}>
            <Grid layout="fluid">
              <GridColumn medium={2} />
              <GridColumn medium={8}>
                {data.map(d => <Comment key={d.id} data={d} />)}
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
