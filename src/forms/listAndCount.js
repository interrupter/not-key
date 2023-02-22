const notNode = require("not-node");

const { MODULE_NAME } = require("../const");
const Form = require("not-node").Form;
const getIP = require("not-node").Common.getIP;
const notFilter = require("not-filter");

const FIELDS = [
    ["query", `not-filter//_filterQuery`],
    ["activeUserId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:ListAndCountForm`;

module.exports = class ListAndCountForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    extract(req) {
        const thisSchema = notNode.Application.getModelSchema(
            `${MODULE_NAME}//Key`
        );
        const { skip, size } = notFilter.pager.process(req), //skip,size
            sorter = notFilter.sorter.process(req, thisSchema),
            search = notFilter.search.process(req, thisSchema),
            filter = notFilter.filter.process(req, thisSchema);
        return {
            query: {
                skip,
                size,
                sorter,
                filter,
                search,
            },
            activeUser: req.user,
            activeUserId: req.user._id,
            ip: getIP(req),
        };
    }
};
