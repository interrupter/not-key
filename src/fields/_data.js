const notNode = require('not-node');
const Schema = require('mongoose').Schema;
const {MODULE_NAME} = require('../const');

module.exports = {
	model:{
		type: Schema.Types.Mixed,
		required: true,
		validate: [{
			validator(val) {
				return notNode.Application.getForm(`${MODULE_NAME}//_data`).run(val);
			},
			message: 'key_data_is_not_valid'
		}]
	}
};
