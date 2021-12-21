const notNode = require('not-node');

const ERR_INVALID_KEY = 'Invalid key';
const ERR_EMPTY_REPORT_OR_TYPE = 'Empty report or type fields';
const ERR_EMPTY_KEY_NO_CONSUMERS = 'Key is empty, no consumers';
const ERR_EMPTY_KEY = 'Key is empty';
const ERR_NO_KEY = 'No key';
const ERR_NO_ORIGIN = 'No origin info in headers';
const ERR_INVALID_ORIGIN = 'Invalid origin of request';
const ERR_INVALID_KEY_OR_ORIGIN = 'Invalid key or origin of request';
const ERR_NO_COLLECTOR_MODEL = 'Collector model not exists';
const ERRS = [
	ERR_INVALID_KEY,
	ERR_EMPTY_REPORT_OR_TYPE,
	ERR_EMPTY_KEY_NO_CONSUMERS,
	ERR_EMPTY_KEY,
	ERR_NO_KEY,
	ERR_NO_ORIGIN,
	ERR_INVALID_ORIGIN,
	ERR_INVALID_KEY_OR_ORIGIN,
	ERR_NO_COLLECTOR_MODEL
];

const NAME = 'Key';
exports.thisLogicName = NAME;

class Key {
	static async collect({inKey, report, type, orgn}) {
		try{
			const App = notNode.Application;
			let Key = App.getModel('not-key//Key');
			if (
				typeof report !== 'undefined' && report !== null &&
        typeof type !== 'undefined' && type !== null
			){
				let key = await Key.findActiveByKeyOrOrigin(inKey, orgn);
				if (!key) {
					notNode.Application.logger.error(orgn);
					throw new Error(ERR_INVALID_KEY_OR_ORIGIN);
				}
				if (key.crate && key.crate.consumers) {
					let list = [];
					for (let t in key.crate.consumers) {
						if (typeof t !== 'undefined') {
							let model = App.getModel(t);
							if (model) {
								let statMethod = model[key.crate.consumers[t]];
								list.push(statMethod(report, key, type));
							} else {
								App.logger.error(new Error(ERR_NO_COLLECTOR_MODEL));
								App.logger.error(t);
							}
						}
					}
					let results = await Promise.all(list);
					return {
						status: 'ok',
						results
					};
				} else {
					throw new Error(ERR_EMPTY_KEY_NO_CONSUMERS);
				}
			} else {
				throw new Error(ERR_EMPTY_REPORT_OR_TYPE);
			}
		}catch(e){
			notNode.Application.logger.error(e);
			notNode.Application.report(e);
			let ret = { status: 'error' };
			if (ERRS.indexOf(e.message) > -1) {
				ret.message = e.message;
			}
			return ret;
		}
	}
}

exports[NAME] = Key;
