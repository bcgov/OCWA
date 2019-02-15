const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    id: {type: String, required: true, index: true},
    email: {type: String, required: true, index: true},
    firstName: {type: String, required: true, index: true},
    lastName: {type: String, required: true, index: true},
    name: {type: String, required: true, index: true},
    groups: {type: [String], required: true, index: true}
});

var model = mongoose.model('user', userSchema);

module.exports = model;