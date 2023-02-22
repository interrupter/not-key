const { MODULE_NAME } = require("../const");
//DB related validation tools
const Form = require("not-node").Form;
//not-node
const getIP = require("not-node").Common.getIP;
const origin = require("original");
//form
const FIELDS = [
    ["key", "not-key//key"],
    ["origin", "not-key//origin"],
    ["report", "not-node//requiredObject"],
    ["type", "not-key//reportType"],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:CollectForm`;

const validateReportType = require("./validators/validateReportType");
const validateReportKey = require("./validators/validateReportKey");

/**
 *
 **/
module.exports = class CollectForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    /**
     * Extracts data
     * @param {ExpressRequest} req expressjs request object
     * @return {Object}        forma data
     **/
    extract(req) {
        const data = {
            origin: req.headers.origin ? origin(req.headers.origin) : false,
            key: req.body.key,
            ip: getIP(req),
            type: req.body.type,
            report: req.body.report,
        };
        return data;
    }

    getFormValidationRules() {
        return [validateReportType, validateReportKey];
    }
};
