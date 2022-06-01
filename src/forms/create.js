const {MODULE_NAME} = require('../const');
//DB related validation tools
const Form = require('not-node').Form;
//not-node
const	getIP = require('not-node').Auth.getIP;
//form
const FIELDS = [
  ['title', { default: ''}, 'not-node//title'],
  ['key', 'not-key//key'],
  ['origins', 'not-key//listOfUrls'],
  ['crate', 'not-node//requiredObject'],
  ['expiredAt', 'not-node//expiredAt'],
];

const FORM_NAME = `${MODULE_NAME}:CreateForm`;

/**
	*
	**/
module.exports = class CreateForm extends Form{

  constructor({app}){
    super({FIELDS, FORM_NAME, app});
  }

  /**
	* Extracts data
	* @param {ExpressRequest} req expressjs request object
	* @return {Object}        forma data
	**/
  extract(req){
    const data = {
      title: req.data.title,
      expiredAt: req.data.expiredAt,
    };
    if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
      data.crate = JSON.parse(req.body.crate);
    } else {
      data.crate = {};
    }
    if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
      data.origins = req.body.origins.split("\n");
    } else {
      data.origins = [];
    }
    if (!(typeof req.body.key !== 'undefined' && req.body.key !== null && req.body.key.length > 10)) {
      data.key = uuidv4();
    }else{
      data.key = req.body.key;
    }
    return data;
  }

  getFormValidationRules(){
    return [];
  }

};
