module.exports = {
	title: {
		type: 'UITextfield',
		placeholder: 'title',
		label: 'Title'
	},
	key: {
		type: 'UITextfield',
		placeholder: 'key field leave empty to auto gen uuidv4',
		label: 'Key'
	},
	keyID: {
		type: 'UITextfield',
		placeholder: 'keyID',
		label: 'KeyID',
		readonly: true
	},
	crate: {
		type: 'UITextarea',
		placeholder: 'Valid JSON data or leave empty, data associated with this key',
		label: 'Crate'
	},
	createdAt: {
		type: 'UIDate',
		disabled: true,
		placeholder: 'date',
		label: 'Created at'
	},
	updatedAt: {
		type: 'UIDate',
		disabled: true,
		placeholder: 'date',
		label: 'Updated at'
	},
	expiredAt: {
		type: 'UIDate',
		placeholder: 'date',
		label: 'Expired at'
	}
};
