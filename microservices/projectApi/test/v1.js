process.env.NODE_ENV = 'test';

describe("V1", function() {
    require('./v1/admin');
    require('./v1/permissions')
});
