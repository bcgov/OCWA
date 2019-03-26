const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: {type: String, unique: true, required: true, index: true},
    permissions: {type: Object, required: true, index: true}
});

var model = mongoose.model('project', projectSchema);

module.exports = model;
