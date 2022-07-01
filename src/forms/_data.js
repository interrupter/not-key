const {MODULE_NAME} = require('../const');

const Form = require('not-node').Form;
const FIELDS = [
	['title', { default: ''}, 'not-node//title'],
    ['key', 'not-key//key'],
    ['origins', 'not-key//listOfUrls'],
    ['crate', 'not-node//requiredObject'],
	['owner', 'not-node//owner'],
    ['expiredAt', 'not-node//expiredAt'],
];

const FORM_NAME = `${MODULE_NAME}:_DataForm`;

module.exports = class _DataForm extends Form{
	constructor({app}){
		super({FIELDS, FORM_NAME, app});
	}

	extract(data){return data;}

	getFormValidationRules(){
		return [];
	}

};
