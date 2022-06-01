const generatePaths = require('not-node').Common.generatePaths;

const {MODULE_NAME} = require('./const.js');
const content = [
	'models', 'logics', 'locales',
	'fields','forms', 'controllers', 'routes'
];

module.exports = {
	name: MODULE_NAME,
	paths: generatePaths(content, __dirname)
};
