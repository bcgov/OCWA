const config = require('config');

const app = require('./app');

const port = config.get('port');

app.listen(port, error => {
  if (!error) {
    console.log(`OWCA is running on port: ${port}...`); // eslint-disable-line
  }
});

module.exports = app;
