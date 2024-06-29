import Validators from "../lib/validators.js";

import { Frame } from "not-bulma";

import CRUDActionList from "not-bulma/src/frame/crud/actions/list";

const { notCRUD } = Frame;

const MODULE_NAME = "";
const MODEL_NAME = "Key";

const LABELS = {
    plural: "Ключи",
    single: "Ключ",
};

class ncKey extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;
    constructor(app, params) {
        super(app, `${MODULE_NAME}.${MODEL_NAME}`);
        this.setModuleName(MODULE_NAME);
        this.setModelName(MODEL_NAME);
        this.setOptions("names", LABELS);
        this.setOptions("Validators", Validators);
        this.setOptions("params", params);
        this.setOptions("list", {
            interface: {
                combined: true,
                factory: this.make.key,
            },
            endless: false,
            preload: {},
            sorter: {
                id: -1,
            },
            actions: [],
            showSearch: true,
            idField: "_id",
            fields: [
                {
                    path: ":keyID",
                    title: "ID",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":title",
                    title: "Название",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":key",
                    title: "Ключ",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":expiredAt",
                    title: "Истекает",
                    sortable: true,
                    searchable: true,
                },
                {
                    path: ":_id",
                    title: "Действия",
                    type: "button",
                    preprocessor: (value) => {
                        return CRUDActionList.createActionsButtons(this, value);
                    },
                },
            ],
        });

        this.start();
        return this;
    }

    createDefault() {
        let t = new Date();
        t.setMonth(t.getMonth() + 1);
        let newRecord = this.make[this.getModelName()]({
            _id: null,
            key: "",
            title: LABELS.single,
            expiredAt: t.toISOString(),
            crate: JSON.stringify({}),
        });
        return newRecord;
    }
}

export default ncKey;
