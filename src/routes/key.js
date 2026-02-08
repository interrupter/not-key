const { MODULE_NAME } = require("../const");

const notNode = require("not-node");

const MODEL_NAME = "Key";

const { before, after, getLogic, Log } = notNode.Bootstrap.notBootstrapRoute({
    target: module,
    MODULE_NAME,
    MODEL_NAME,
    defaultAccessRule: true,
});

try {
    const KeyGenericRoute = notNode.Generic.GenericRoute({
        getLogic,
        before,
        after,
    });

    class KeyRoute extends KeyGenericRoute {
        static async collect(req, res, next, prepared) {
            return await getLogic().collect(prepared);
        }
    }

    module.exports = KeyRoute;
} catch (e) {
    Log.error(e);
}
