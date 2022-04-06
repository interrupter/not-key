const {MODULE_NAME} = require('../const');
//DB related validation tools
const Form = require('not-node').Form;
//not-node
const	getIP = require('not-node').Auth.getIP;
//form
const FIELDS = [
  ['username', 'not-user//username'],
  ['email', 'not-user//email'],
  ['password', 'not-user//password'],
  ['passwordRepeat', 'not-user//password'],
  ['role', 'not-user//role'],
  ['telephone', 'not-user//telephone'],
  ['country', 'not-user//country'],
  ['active', 'not-user//active'],
  ['ip', 'not-user//ip']
];

const FORM_NAME = `${MODULE_NAME}:CreateForm`;

//form validators
const validateUsernameAvailability = require('./validators/validateUsernameAvailability');
const validatePasswords = require('./validators/validatePasswords');

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
    if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
      req.body.crate = JSON.parse(req.body.crate);
    } else {
      req.body.crate = {};
    }
    if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
      req.body.origins = req.body.origins.split("\n");
    } else {
      delete req.body.origins;
    }
    if (!(typeof req.body.key !== 'undefined' && req.body.key !== null && req.body.key.length > 10)) {
      req.body.key = uuidv4();
    }
    req.body.owner = req.user._id;
    req.body.ownerModel = 'User';

    return data;
  }

  getFormValidationRules(){
    return [
      validateUsernameAvailability,
      validatePasswords,
    ];
  }

};
