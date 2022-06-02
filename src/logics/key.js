const notNode = require('not-node');
const { isFunc} = notNode.Common;
const {ERR_NO_COLLECTOR_MODEL} = require('../const.js');

const NAME = 'Key';
exports.thisLogicName = NAME;

class Key {
  static async update({
    key
  }) {
    const App = notNode.Application;
    let Key = App.getModel('not-key//Key');
    let item = await thisModel.updateOne({
        _id: key._id,
      },
      key
    ).exec();
    if (item.n !== 1) {
      throw new Error('No document to update');
    }
  }

  static async collect({
    input
  }) {
    const App = notNode.Application;
    let keyDoc = await notNode.Application.getModel('not-key//Key').findActiveByKeyOrOrigin(input.key, input.origin);
    let list = [];
    for (let consumerModelName in keyDoc.crate.consumers) {
      if (typeof consumerModelName !== 'undefined') {
        let model = App.getModel(consumerModelName);
        if (model) {
          let statMethod = model[keyDoc.crate.consumers[consumerModelName]];
          if (isFunc(statMethod) ){
            list.push(statMethod(input.report, keyDoc, input.type));
          }
        } else {
          App.log.error(new notError(ERR_NO_COLLECTOR_MODEL, { modelName: t}));
        }
      }
    }
    let results = await Promise.all(list);
    return results;
  }

}

exports[NAME] = Key;
