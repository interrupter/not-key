const Log = require('not-log')(module, 'Key:Routes');

try {
	const initFromSchema = require('not-node').Fields.fromSchema;
	const modelSchema = require('../models/key').thisSchema;
	const FIELDS = initFromSchema(modelSchema,
  	[
  		['_id', {}, '_id'],
  		['keyID', {}, 'ID'],
			[
				'crate',
				{
					component: 'UITextarea',
  		    placeholder: 'Valid JSON data or leave empty, data associated with this key',
					label: 'Crate'
				}
			]
  	]
	);

	module.exports = {
		model: 'key',
		url: '/api/:modelName',
		fields: FIELDS,
		actions: {
			create: {
				method: 'PUT',
				isArray: false,
				data: ['record'],
				rules: [{
					admin: true,
					fields: ['title', 'key', 'crate', 'expiredAt']
				}],
				title: 'Creation of new key'
			},
			collect: {
				method: 'PUT',
				postFix: '/:actionName',
				isArray: false,
				data: ['record'],
				rules: [{
					auth: false
				},
				{
					auth: true
				},
				{
					admin: true
				}
				]
			},
			update: {
				method: 'POST',
				isArray: false,
				postFix: '/:record[_id]/update',
				data: ['record'],
				auth: true,
				admin: true,
				title: 'Update of a key',
				fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt']
			},
			listAndCount: {
				method: 'GET',
				isArray: false,
				postFix: '/:actionName',
				data: ['record', 'pager', 'sorter', 'filter', 'searcher', 'return'],
				fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt'],
				rules: [{
					auth: true,
					role: ['admin']
				}, {
					auth: true,
					admin: true
				}]
			},
			latest: {
				method: 'GET',
				isArray: true,
				postFix: '/:actionName',
				data: ['record'],
				fields: ['_id', 'title', 'key', 'crate', 'expiredAt'],
				rules: [{
					auth: true,
					admin: true
				}]
			},
			get: {
				method: 'GET',
				isArray: false,
				postFix: '/:record[_id]',
				data: ['record'],
				rules: [{
					auth: true,
					admin: true,
					fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt']
				}]
			},
			getRaw: {
				method: 'GET',
				isArray: false,
				postFix: '/:record[_id]/:actionName',
				data: ['record'],
				rules: [{
					auth: true,
					admin: true,
					fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt']
				}]
			},
			delete: {
				method: 'DELETE',
				data: ['record'],
				postFix: '/:record[_id]',
				isArray: false,
				rules: [{
					auth: true,
					admin: true
				}]
			}
		}
	};

} catch (e) {
	Log.error(e);
}
