const generatePaths = require('not-node').Common.generatePaths;

const {MODULE_NAME} = require('./const');
const content = [
	'models', 'logics', 'locales',
	'fields', 'controllers', 'routes'
];

module.exports = {
	name: MODULE_NAME,
	paths: generatePaths(content, __dirname)
};
