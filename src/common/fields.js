module.exports = {
	title: {
		component: 'UITextfield',
		placeholder: 'title',
		label: 'Title'
	},
	key: {
		component: 'UITextfield',
		placeholder: 'key field leave empty to auto gen uuidv4',
		label: 'Key'
	},
	keyID: {
		component: 'UITextfield',
		placeholder: 'keyID',
		label: 'KeyID',
		readonly: true
	},
	crate: {
		component: 'UITextarea',
		placeholder: 'Valid JSON data or leave empty, data associated with this key',
		label: 'Crate'
	},
	createdAt: {
		component: 'UIDate',
		disabled: true,
		placeholder: 'date',
		label: 'Created at'
	},
	updatedAt: {
		component: 'UIDate',
		disabled: true,
		placeholder: 'date',
		label: 'Updated at'
	},
	expiredAt: {
		component: 'UIDate',
		placeholder: 'date',
		label: 'Expired at'
	}
};
