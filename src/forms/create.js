const { MODULE_NAME } = require("../const");
//DB related validation tools
const Form = require("not-node").Form;
//not-node
const getIP = require("not-node").Common.getIP;
const { v4: uuidv4 } = require("uuid");
//form
const FIELDS = [
    ["activeUser", "not-node//requiredObject"],
    ["data", `${MODULE_NAME}//_data`],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:CreateForm`;

/**
 *
 **/
module.exports = class CreateForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    /**
     * Extracts data
     * @param {ExpressRequest} req expressjs request object
     * @return {Object}        forma data
     **/
    extract(req) {
        const ip = getIP(req);
        let data = this.extractData(req);
        if (!req.user.isRoot() && !req.user.isAdmin()) {
            delete data.owner;
            delete data.ownerModel;
        }
        return {
            data,
            activeUser: req.user,
            ip,
        };
    }

    extractData(req) {
        const data = {
            title: req.body.title,
            expiredAt: req.body.expiredAt,
            crate: req.body.crate,
            origins: req.body.origins,
        };
        if (
            !(
                typeof req.body.key !== "undefined" &&
                req.body.key !== null &&
                req.body.key.length > 10
            )
        ) {
            data.key = uuidv4();
        } else {
            data.key = req.body.key;
        }
        return data;
    }

    getFormValidationRules() {
        return [];
    }
};
