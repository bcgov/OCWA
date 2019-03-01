process.env.NODE_ENV = 'test';

describe("V1", function() {
    require('./v1/collaborators');
    require('./v1/permissions');
    require('./v1/topic');
    require('./v1/comment');
});