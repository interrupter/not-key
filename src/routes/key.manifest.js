module.exports = {
	model: 'key',
	url: '/api/:modelName',
	fields: {
		title: {
			type: 'textfield',
			placeholder: 'title',
			label: 'Title'
		},
		key: {
			type: 'textfield',
			placeholder: 'key field leave empty to auto gen uuidv4',
			label: 'Key'
		},
		crate: {
			type: 'textarea',
			placeholder: 'Valid JSON data or leave empty, data associated with this key',
			label: 'Crate'
		},
		createdAt: {
			type: 'date',
			disabled: true,
			placeholder: 'date',
			label: 'Created at'
		},
		updatedAt: {
			type: 'date',
			disabled: true,
			placeholder: 'date',
			label: 'Updated at'
		},
		expiredAt: {
			type: 'date',
			placeholder: 'date',
			label: 'Expired at'
		},
		submit: {
			type: 'submit'
		}
	},
	actions: {
		create:{
			method: 'PUT',
			isArray: false,
			data: ['record'],
			rules:[
				{
					admin: true
				}
			],
			title: 'Creation of new key',
			fields: {
				admin: [
					'title',
					'key',
					'crate',
					'expiredAt',
					'submit'
				]
			}
		},
		collect:{
			method: 'PUT',
			postFix: '/:actionName',
			isArray: false,
			data: ['record'],
			rules:[
				{
					auth: false
				}
			]
		},
		update:{
			method: 'POST',
			isArray: false,
			postFix: '/:record[_id]/update',
			data: ['record'],
			auth: true,
			admin: true,
			title: 'Update of a key',
			fields: {
				admin: [
					'title',
					'key',
					'crate',
					'expiredAt',
					'submit'
				]
			}
		},
		getRaw: {
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]/:actionName',
			data: [],
			rules: [{
				auth: 	true,
				admin:	true
			}]
		},
		listAndCount:{
			method: 'GET',
			isArray: false,
			postFix: '/:actionName',
			data: ['pager', 'sorter', 'filter', 'searcher', 'return'],
			rules: [{
				auth: 	true,
				role: 	['admin']
			},{
				auth: 	true,
				admin: 	true
			}]
		},
		latest:{
			method: 'GET',
			isArray: true,
			postFix: '/:actionName',
			data: [],
			rules: [{
				auth: 	true,
				admin: 	true
			}]
		},
		delete: {
			method: 'DELETE',
			postFix: '/:record[_id]',
			isArray: false,
			rules: [{
				auth: 	true,
				admin: 	true
			}]
		}
	}
};
