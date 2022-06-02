module.exports = {
	model:{
		type: String,
		required: true,
		searchable: true,
		sortable: true,
		unique:false,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	ui: {
		component: 'UITextfield',
		placeholder: 'report type field',
		label: 'Rerpot type'
	},
};
