const Log = require("not-log")(module, "Key:Routes");
const {
    ACTION_DATA_TYPES,
    ACTION_DATA_TYPES_VALUES,
} = require("not-node/src/manifest/const");

try {
    const FIELDS = [
        ["_id", {}, "_id"],
        ["keyID", {}, "ID"],
        ["crate", {}, "not-key//crate"],
        [
            "origins",
            {
                label: "Origins",
                placeholder:
                    "List of origins from which request enabled. Use with caution. No key needed for this kind of requests, but origin could be forged.",
            },
            "listOfUrls",
        ],
        ["expiredAt", { readonly: false }, "expiredAt"],
        [
            "owner",
            { label: "not-node:field_owner_label", component: "UISelectUser" },
            "not-node//owner",
        ],
    ];

    module.exports = {
        model: "key",
        url: "/api/:modelName",
        fields: FIELDS,
        actions: {
            create: {
                method: "PUT",
                isArray: false,
                data: [ACTION_DATA_TYPES.DATA],
                rules: [
                    {
                        root: true,
                        fields: [
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "expiredAt",
                        ],
                    },
                ],
                title: "Creation of new key",
            },
            collect: {
                method: "PUT",
                postFix: "/:actionName",
                isArray: false,
                data: [ACTION_DATA_TYPES.DATA],
                rules: [
                    {
                        auth: false,
                    },
                    {
                        auth: true,
                    },
                    {
                        root: true,
                    },
                ],
            },
            update: {
                method: "POST",
                isArray: false,
                postFix: "/:record[_id]/update",
                data: [ACTION_DATA_TYPES.DATA],
                rules: [
                    {
                        root: true,
                    },
                ],
                title: "Update of a key",
                fields: [
                    "_id",
                    "keyID",
                    "title",
                    "key",
                    "crate",
                    "origins",
                    "owner",
                    "expiredAt",
                ],
            },
            listAll: {
                method: "GET",
                isArray: true,
                postFix: "/:actionName",
                data: [...ACTION_DATA_TYPES_VALUES],
                rules: [
                    {
                        auth: true,
                        role: ["client"],
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "expiredAt",
                        ],
                    },
                    {
                        auth: true,
                        role: ["admin"],
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                    {
                        root: true,
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                ],
            },
            listAndCount: {
                method: "GET",
                isArray: false,
                postFix: "/:actionName",
                data: [...ACTION_DATA_TYPES_VALUES],
                rules: [
                    {
                        auth: true,
                        role: ["client"],
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "expiredAt",
                        ],
                    },
                    {
                        auth: true,
                        role: ["admin"],
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                    {
                        root: true,
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                ],
            },
            get: {
                method: "GET",
                isArray: false,
                postFix: "/:record[_id]",
                data: ["record"],
                rules: [
                    {
                        root: true,
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                ],
            },
            getRaw: {
                method: "GET",
                isArray: false,
                postFix: "/:record[_id]/:actionName",
                data: ["record"],
                rules: [
                    {
                        root: true,
                        fields: [
                            "_id",
                            "keyID",
                            "title",
                            "key",
                            "crate",
                            "origins",
                            "owner",
                            "expiredAt",
                        ],
                    },
                ],
            },
            delete: {
                method: "DELETE",
                data: ["record"],
                postFix: "/:record[_id]",
                isArray: false,
                rules: [
                    {
                        root: true,
                    },
                ],
            },
        },
    };
} catch (e) {
    Log.error(e);
}
