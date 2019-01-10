const uuidv4	=	require('uuidv4');
const App	=	require('not-node').Application;
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
		MODEL_TITLE: 	'Ключ',
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
					item.expiredAt = item.expiredAt.toISOString();
				}
				res.status(200).json(item);
			})
			.catch((err)=>{
				res.status(500).json(err);
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
	}
};

modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
