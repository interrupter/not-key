const {MODULE_NAME} = require('../const');
//DB related validation tools
const Form = require('not-node').Form;
//not-node
const	getIP = require('not-node').Auth.getIP;
const origin = require('original');
//form
const FIELDS = [
  ['key', 'not-key//key'],
  ['origins', 'not-key//listOfUrls'],
  ['crate', 'not-node//requiredObject'],
  ['report', 'not-node//requiredObject'],
  ['type', 'not-key//keyType'],
  ['ip', 'not-user//ip']
];

const FORM_NAME = `${MODULE_NAME}:CollectForm`;

/**
	*
	**/
module.exports = class CollectForm extends Form{

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
      origin: req.headers.origin ? origin(req.headers.origin) : false,
      crate: {},
      ip: ip = getIP(req),
      type: req.body.type,
      report: req.body.report,
    };
    if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
      data.crate = JSON.parse(req.body.crate);
    }
    if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
      data.origins = req.body.origins.split("\n");
    }
    return data;
  }

  getFormValidationRules(){
    return [];
  }

};
