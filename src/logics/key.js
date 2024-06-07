const notNode = require("not-node");
const notError = require("not-error/src/error.node.cjs");

const { isFunc } = notNode.Common;
const {
    MODULE_NAME,
    ERR_NO_COLLECTOR_MODEL,
    MAX_KEY_COUNT,
    OWNER_MODEL,
    DOCUMENT_OWNER_FIELD_NAME,
} = require("../const.js");

const MODEL_NAME = "Key";

const {
    Log,
    LogAction,
    say,
    phrase,
    config,
    getModel,
    getModelSchema,
    getModelUser,
} = notNode.Bootstrap.notBootstrapLogic({
    target: module,
    MODEL_NAME,
    MODULE_NAME,
});

exports.thisLogicName = MODEL_NAME;

const GenericKeyLogic = notNode.Generic.GenericLogic({
    MODEL_NAME,
    MODULE_NAME,
    Log,
    LogAction,
    say,
    phrase,
    config,
    getModel,
    getModelSchema,
    getModelUser,
});

class KeyLogic extends GenericKeyLogic {
    static async collect({ key, origin, ip, type, report }) {
        const App = notNode.Application;
        let keyDoc = await getModel().findActiveByKeyOrOrigin(key, origin);
        let list = [];
        if (keyDoc && keyDoc.crate) {
            for (let consumerModelName in keyDoc.crate.consumers) {
                if (typeof consumerModelName !== "undefined") {
                    let model = App.getModel(consumerModelName);
                    if (model) {
                        let statMethod =
                            model[keyDoc.crate.consumers[consumerModelName]];
                        if (isFunc(statMethod)) {
                            list.push(statMethod(report, keyDoc, type));
                        }
                    } else {
                        App.logger.error(
                            new notError(ERR_NO_COLLECTOR_MODEL, {
                                modelName: consumerModelName,
                                ip,
                                origin,
                            })
                        );
                    }
                }
            }
            let results = await Promise.all(list);
            return results;
        } else {
            App.logger.error("No key document for ", key, origin, ip);
            return list;
        }
    }

    static async _listAll({ identity, ip, action, shouldOwn = false, root }) {
        Log.debug(`${MODULE_NAME}//Logic//${MODEL_NAME}//${action}`, ip, root);
        let filter = {};
        if (shouldOwn) {
            filter = {
                [DOCUMENT_OWNER_FIELD_NAME]: identity.uid,
            };
        }
        const result = await getModel().listAndCount(
            0,
            MAX_KEY_COUNT,
            [["title", "ascending"]],
            filter
        );
        LogAction({
            action,
            by: identity.uid,
            role: identity.role,
            ip,
            root,
            shouldOwn,
        });
        return result;
    }
}

module.exports[MODEL_NAME] = KeyLogic;
