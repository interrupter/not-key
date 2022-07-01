module.exports = {
	model:{
		type:       String,
		required:   false,
		searchable: true,
		sortable:   true,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	ui: {
		component: 'UITextfield',
		placeholder: 'origin url',
		label: 'Origin URL'
	},
};
