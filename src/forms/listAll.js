const notNode = require("not-node");

const { MODULE_NAME } = require("../const");
const Form = require("not-node").Form;
const getIP = require("not-node").Common.getIP;
const notFilter = require("not-filter");

const FIELDS = [
    ["activeUserId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:ListAllForm`;

module.exports = class ListAllForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    extract(req) {
        return {
            activeUser: req.user,
            activeUserId: req.user._id,
            ip: getIP(req),
        };
    }
};
