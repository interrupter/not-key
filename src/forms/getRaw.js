const { MODULE_NAME } = require("../const");
//DB related validation tools
const Form = require("not-node").Form;
//not-node
const getIP = require("not-node").Common.getIP;
//form
const FIELDS = [
    ["targetId", { required: true }, "not-node//objectId"],
    ["activeUserId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["ip", "not-node//ip"],
];
const FORM_NAME = `${MODULE_NAME}:GetRawForm`;

module.exports = class GetRawForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    extract(req) {
        return {
            targetId: req.params._id,
            activeUser: req.user,
            activeUserId: req.user._id,
            ip: getIP(req),
        };
    }
};
