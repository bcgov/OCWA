const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var permissionSchema = new Schema({
    label: {type: String, unique: true, required: true, index: true},
    value: {type: mongoose.Mixed, required: true}
});

var projectSchema = new Schema({
    name: {type: String, unique: true, required: true, index: true},
    permissions: {type: [permissionSchema], required: true, index: true}
});

var model = mongoose.model('user', projectSchema);

module.exports = model;
