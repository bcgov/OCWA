process.env.NODE_ENV = 'test';

describe("OCWA Unit Tests", function() {
    require('./v1/requests');
    require('./util/util');
    require('./notifications/gitops');
});
