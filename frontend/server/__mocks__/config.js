'use strict';

const oemConfig = require('config')

const config = jest.genMockFromModule('config');

config.override = {}
config.get = (g => (g in config.override ? config.override[g] : oemConfig.get(g)));

module.exports = config;