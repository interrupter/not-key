const notNode = require('not-node');

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
    let Key = App.getModel('not-key//Key');
    let list = [];
    for (let consumerModelName in input.key.crate.consumers) {
      if (typeof consumerModelName !== 'undefined') {
        let model = App.getModel(consumerModelName);
        if (model) {
          let statMethod = model[input.key.crate.consumers[consumerModelName]];
          list.push(statMethod(input.report, input.key, input.type));
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
