const uuidv4  =  require('uuid').v4;
const App  =  require('not-node').Application;
const ERR_INVALID_KEY = 'Invalid key';
const ERR_EMPTY_KEY_NO_CONSUMERS = 'Key is empty, no consumers';
const ERR_EMPTY_KEY = 'Key is empty';
const ERR_NO_KEY = 'No key';
const ERR_NO_COLLECTOR_MODEL = 'Collector model not exists';
const ERRS = [ERR_INVALID_KEY,ERR_EMPTY_KEY_NO_CONSUMERS,ERR_EMPTY_KEY,ERR_NO_KEY,ERR_NO_COLLECTOR_MODEL];
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
		MODEL_TITLE:   'Ключ',
		RESPONSE:{
			full: ['get']
		},
		before:{
			create(args){
				return new Promise((resolve, reject)=>{
					try{
						let {req} = args;
						if(typeof req.body.crate !== 'undefined' && req.body.crate !== null  && req.body.crate.length > 1){
							req.body.crate = JSON.parse(req.body.crate);
						}else{
							req.body.crate = {};
						}
						if(!(typeof req.body.key !== 'undefined' && req.body.key !== null && req.body.key.length > 10)){
							req.body.key = uuidv4();
						}
						resolve();
					}catch(e){
						reject(e);
					}
				});
			}
		}
	},
	modMeta = require('not-meta');

module.exports = {
	_getRaw (req, res) {
		let id = req.params._id,
			thisModel = App.getModel(MODEL_NAME);
		thisModel.getOneRaw(id)
			.then((item)=>{
				item = item.toObject();
				item.crate = JSON.stringify(item.crate);
				if(item.expiredAt instanceof Date){
					if(item.expiredAt.toISOString){
						let exp = item.expiredAt.toISOString();
						item.expiredAt = exp.split('T')[0];
					}
				}
				res.status(200).json({
						status: 'ok',
						result: item
					});
			})
			.catch((err)=>{
				App.report(err);
				res.status(500).json({});
			});
	},
	_update(req, res){
		let id = req.params._id,
			thisModel = App.getModel(MODEL_NAME);
		if(typeof req.body.crate !== 'undefined' && req.body.crate !== null  && req.body.crate.length > 1){
			req.body.crate = JSON.parse(req.body.crate);
		}else{
			req.body.crate = {};
		}
		thisModel.findOneAndUpdate({
			_id: id
		}, req.body).exec()
			.then((item)=>{
				res.status(200).json(item.toObject());
			})
			.catch((err)=>{
				res.status(500).json(err);
			});
	},
	async collect(req, res){
		let Key = App.getModel('Key');
		if (typeof req.body.key !== 'undefined' && req.body.key !== null &&
     typeof req.body.report !== 'undefined' && req.body.report !== null &&
   typeof req.body.type !== 'undefined' && req.body.type !== null){
			Key.check(req.body.key.toString())
				.then((result)=>{
					if(result){
						return true;
					}else{
						throw new Error(ERR_INVALID_KEY);
					}
				})
				.then(async()=>{
					try{
						let key = await Key.findOne({key: req.body.key}).exec();
						return key;
					}catch(e){
						throw e;
					}
				})
				.then(async(key)=>{
					try{
						if(key){
							if(key.crate && key.crate.consumers){
								let list = [];
								for(let t in key.crate.consumers){
									if(typeof t !== 'undefined'){
										let model = App.getModel(t);
										if(model){
											let statMethod = model[key.crate.consumers[t]];
											list.push(statMethod(req.body.report, key, req.body.type));
										}else{
											App.logger.error(new Error(ERR_NO_COLLECTOR_MODEL));
										}
									}
								}
								let results = await Promise.all(list);
								res.status(200).json({results});
							}else{
								throw new Error(ERR_EMPTY_KEY_NO_CONSUMERS);
							}
						}else{
							throw new Error(ERR_EMPTY_KEY);
						}
					}catch(e){
						throw e;
					}
				})
				.catch((err)=>{
					if (ERRS.indexOf(err.message) > -1){
						res.status(404).json({
							message: err.message
						});
					}else{
						res.status(500).json({});
					}
				});
		}else{
			res.status(404).json({message: ERR_NO_KEY});
		}
	}
};
modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
