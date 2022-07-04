const notNode = require("not-node");
const { notValidationError } = require("not-error");
const { ERR_EMPTY_REPORT_OR_TYPE } = require("../../const");

module.exports = async ({ report, type } /*, validationEnvs*/) => {
    if (
        typeof report === "undefined" ||
        report === null ||
        typeof type === "undefined" ||
        type === null
    ) {
        throw new notValidationError(
            `not-key:${ERR_EMPTY_REPORT_OR_TYPE}`,
            {},
            undefined,
            {}
        );
    }
};
