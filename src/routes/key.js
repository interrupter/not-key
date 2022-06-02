const {
  MODULE_NAME
} = require('../const');

const Log = require('not-log')(module, 'Key:Routes');
const say = require('not-locale').sayForModule(MODULE_NAME);
const {objHas} = require('not-node').Common;
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
      short: true,
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


  function getLogic() {
    const notApp = notNode.Application;
    return notApp.getLogic('not-key//Key');
  }


  module.exports.before = async (req, res, next) => {
    Log.debug('before');
    const name = req.notRouteData.actionName;
    Log.debug('action name', name);
    const FormValidator = notNode.Application.getForm(['not-key', name.replace('_', '')].join('//'));
    if (FormValidator) {
      Log.debug('FormValidator: ', FormValidator.FORM_NAME);
      const result = await FormValidator.run(req, res, next);
      Log.debug('before route action');
      return result;
    } else {
      Log.debug('no form validator');
      return {};
    }
  };


  module.exports.after = (req, res, next, result) => {
    Log.log('after');
    const name = req.notRouteData.actionName;
    if (result && objHas(result, '__redirect__')) {
      res.status(200).redirect(result.__redirect__);
    } else {
      res.status(200).json({
        status: 'ok',
        message: say(`action_message_${name}_success`, {}, res.locals.locale),
        result
      });
    }
  };

  module.exports._getRaw = async (req, res) => {
    const App = notNode.Application;
    const id = req.params._id;
    const thisModel = App.getModel(MODEL_NAME);
    let item = await thisModel.getOneRaw(id);
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
    return item;
  };

  module.exports._update = async (req, res, next, prepared) => {
    const App = notNode.Application;
    App.getLogic('not-key//Key');
    let Key = App.getLogic('Key');
    return await Key.update({key: prepared});
  };

  module.exports.collect = async (req, res, next, prepared) => {
    const App = notNode.Application;
    let Key = App.getLogic('Key');
    return await Key.collect({input: prepared});
  }

  modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
  modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);

} catch (e) {
  Log.error(e);
}
