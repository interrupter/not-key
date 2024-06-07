const { MODULE_NAME } = require("../const");
//DB related validation tools
const Form = require("not-node").Form;
const { v4: uuidv4 } = require("uuid");
//form
const FIELDS = [
    ["targetId", { required: true }, "not-node//objectId"],
    ["identity", "not-node//identity"],
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
     * @param {import('not-node/src/types').notNodeExpressRequest} req expressjs request object
     * @return {Object}        forma data
     **/
    extract(req) {
        let data = this.extractData(req);
        const envs = this.extractRequestEnvs(req);
        if (!envs.identity.isRoot && !envs.identity.isAdmin) {
            typeof data.owner !== "undefined" && delete data.owner;
            typeof data.ownerModel !== "undefined" && delete data.ownerModel;
        }
        return {
            ...envs,
            data,
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
