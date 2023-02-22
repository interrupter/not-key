const { MODULE_NAME } = require("../const");
//DB related validation tools
const Form = require("not-node").Form;
//not-node
const getIP = require("not-node").Common.getIP;
//form
const FIELDS = [
    ["targetId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["data", `${MODULE_NAME}//_data`],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:UpdateForm`;

/**
 *
 **/
module.exports = class UpdateForm extends Form {
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
            typeof data.owner !== "undefined" && delete data.owner;
            typeof data.ownerModel !== "undefined" && delete data.ownerModel;
        }
        return {
            targetId: req.params._id.toString(),
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
            owner: req.body.owner,
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
