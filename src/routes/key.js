const Log = require('not-log')(module, 'Key:Model');
try {
	const notNode = require('not-node');
	const uuidv4 = require('uuid').v4;
	const origin = require('original');


	const
		UserActions = [],
		AdminActions = [
			'create',
			'get',
			'getById',
			'listAndCount',
			'delete'
		],
		MODEL_NAME = 'Key',
		MODEL_OPTIONS = {
			MODEL_NAME,
			MODEL_TITLE: 'Ключ',
			RESPONSE: {
				full: ['get', 'getRaw', 'create']
			},
			before: {
				create(args) {
					return new Promise((resolve, reject) => {
						try {
							let {
								req
							} = args;
							if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
								req.body.crate = JSON.parse(req.body.crate);
							} else {
								req.body.crate = {};
							}
							if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
								req.body.origins = req.body.origins.split("\n");
							} else {
								delete req.body.origins;
							}
							if (!(typeof req.body.key !== 'undefined' && req.body.key !== null && req.body.key.length > 10)) {
								req.body.key = uuidv4();
							}

							req.body.owner = req.user._id;
							req.body.ownerModel = 'User';

							resolve();
						} catch (e) {
							reject(e);
						}
					});
				}
			}
		},
		modMeta = require('not-meta');


	module.exports = {
		_getRaw(req, res) {
			const App = notNode.Application;
			let id = req.params._id,
				thisModel = App.getModel(MODEL_NAME);
			thisModel.getOneRaw(id)
				.then((item) => {
					item = item.toObject();
					item.crate = JSON.stringify(item.crate);
					if(item.origins){
						item.origins = item.origins.join("\n");
					}
					if (item.expiredAt instanceof Date) {
						if (item.expiredAt.toISOString) {
							let exp = item.expiredAt.toISOString();
							item.expiredAt = exp.split('T')[0];
						}
					}
					res.status(200).json({
						status: 'ok',
						result: item
					});
				})
				.catch((err) => {
					App.report(err);
					res.status(500).json({});
				});
		},
		_update(req, res) {
			const App = notNode.Application;
			let id = req.params._id,
				thisModel = App.getModel(MODEL_NAME);
			if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
				req.body.crate = JSON.parse(req.body.crate);
			} else {
				req.body.crate = {};
			}
			if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
				req.body.origins = req.body.origins.split("\n");
			} else {
				delete req.body.origins;
			}
			thisModel.updateOne({
				_id: id
			},
			req.body
			).exec()
				.then((item) => {
					if (item.n === 1) {
						res.status(200).json({
							status: 'ok'
						});
					} else {
						throw new Error('No document to update');
					}
				})
				.catch((err) => {
					res.status(500).json(err);
				});
		},
		async collect(req, res) {
			try {
				let query = {
					orgn:   req.headers.origin?origin(req.headers.origin):false,
					inKey:  req.body.key,
					report: req.body.report,
					type:   req.body.type
				};
				const App = notNode.Application;
				let Key = App.getLogic('Key');
				let result = await Key.collect(query);
				res.status(200).json(result);
			} catch (err) {
				notNode.Application.logger.error(err);
				res.status(500).json({});
			}
		}
	};

	modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
	modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);

} catch (e) {
	Log.error(e);
}
