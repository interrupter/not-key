const {MODULE_NAME} = require('../const');

const Log = require('not-log')(module, 'Key:Routes');
const say = require('not-locale').sayForModule(MODULE_NAME);

try {

  const notNode = require('not-node');
  const origin = require('original');

  const
    UserActions = [],
    AdminActions = [
      'create',
      'get',
      'getById',
      'listAndCount',
      'delete'
    ],
    MODEL_NAME = 'Key',
    MODEL_OPTIONS = {
      MODEL_NAME,
      MODEL_TITLE: 'Ключ',
      RESPONSE: {
        short: [
          'create',
          'get',
          'getRaw',
          'getById',
          'listAndCount',
          'delete'
        ],
        full: ['get', 'getRaw', 'create']
      }
    },
    modMeta = require('not-meta');


    function getLogic(){
      const notApp = notNode.Application;
      return notApp.getLogic('not-key//Key');
    }


    module.exports.before = async (req, res, next) => {
      Log.log('before');
      const name = req.notRouteData.actionName;
      Log.log('action name', name);
      const FormValidator = notNode.Application.getForm(['not-key', name.replace('_', '')].join('//'));
      if (FormValidator){
        Log.log('FormValidator: ', FormValidator.FORM_NAME);
        const result = await FormValidator.run(req, res, next);
        Log.log('before route action');
        return result;
      }else{
        Log.log('no form validator');
        return {};
      }
    };


    module.exports.after = (req, res, next, result)=>{
      Log.log('after');
      if(res.headersSent){return;}
      const name = req.notRouteData.actionName;
      Log.log('after hedaers not sent');
      if(result && objHas(result, '__redirect__')){
        res.status(200).redirect(result.__redirect__);
      }else{
        res.status(200).json({
          status: 'ok',
          message: say(`action_message_${name}_success`, {}, res.locals.locale),
          result
        });
      }
    };

  module.exports._getRaw = (req, res) => {
    const App = notNode.Application;
    let id = req.params._id,
      thisModel = App.getModel(MODEL_NAME);
    thisModel.getOneRaw(id)
      .then((item) => {
        item = item.toObject();
        item.crate = JSON.stringify(item.crate);
        if (item.origins) {
          item.origins = item.origins.join("\n");
        }
        if (item.expiredAt instanceof Date) {
          if (item.expiredAt.toISOString) {
            let exp = item.expiredAt.toISOString();
            item.expiredAt = exp.split('T')[0];
          }
        }
        res.status(200).json({
          status: 'ok',
          result: item
        });
      })
      .catch((err) => {
        App.report(err);
        res.status(500).json({});
      });
  };

  module.exports._update = (req, res) => {
    const App = notNode.Application;
    let id = req.params._id,
      thisModel = App.getModel(MODEL_NAME);
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
    thisModel.updateOne({
          _id: id
        },
        req.body
      ).exec()
      .then((item) => {
        if (item.n === 1) {
          res.status(200).json({
            status: 'ok'
          });
        } else {
          throw new Error('No document to update');
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  module.exports.collect = async (req, res, next, prepared) => {
    try {
      let query = {
        orgn: req.headers.origin ? origin(req.headers.origin) : false,
        inKey: req.body.key,
        report: req.body.report,
        type: req.body.type
      };
      const App = notNode.Application;
      let Key = App.getLogic('Key');
      let result = await Key.collect(query);
      res.status(200).json(result);
    } catch (err) {
      notNode.Application.logger.error(err);
      res.status(500).json({});
    }
  }

  modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
  modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);

} catch (e) {
  Log.error(e);
}
