const
	UserActions = [],
	AdminActions = [
    'create',
		'update',
		'get',
		'getRaw',
		'getById',
		'listAndCount',
		'delete'
	],
	MODEL_NAME = 'Key',
	MODEL_OPTIONS = {
		MODEL_NAME,
		MODEL_TITLE: 	'Ключ'
	},
	modMeta = require('not-meta');

module.exports = {};

modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
