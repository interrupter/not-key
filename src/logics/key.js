const notNode = require('not-node');
const { isFunc} = notNode.Common;
const {ERR_NO_COLLECTOR_MODEL, MAX_KEY_COUNT,OWNER_MODEL} = require('../const.js');

const NAME = 'Key';
exports.thisLogicName = NAME;

function getModel(){
  const App = notNode.Application;
  return App.getModel('not-key//Key');
}

class KeyLogic {
  static async update({
    key
  }) {
    const Key = getModel();
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
    let keyDoc = await getModel().findActiveByKeyOrOrigin(input.key, input.origin);
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

  static async listAll({ ownerId }){
    const Key = getModel();
    const results = await Key.listAndCount(0, MAX_KEY_COUNT, ['title', 'ascending'], { owner: ownerId, ownerModel: OWNER_MODEL });
  }

}

exports[NAME] = KeyLogic;
