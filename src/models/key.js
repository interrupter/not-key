const initFields = require('not-node').Fields.initFields;

const MODEL_NAME = 'Key';
const FIELDS = [
	['title', { default: ''}, 'title'],
	'key',
	'owner',
	'ownerModel',
	['crate', {}, 'requiredObject'],
	'createdAt',
	'expiredAt',
	'updatedAt'
];

exports.enrich = {
	versioning: false,
	increment: true
};

exports.thisModelName = MODEL_NAME;
exports.thisSchema = initFields(FIELDS, 'model');

exports.thisStatics = {
	async check(key){
		return this.find({key}).exec()
			.then((result)=>{
				if(result && result.length > 0){
					return true;
				}else{
					return false;
				}
			});
	},
	async getAllActive(){
		return this.find({
			$or: [
				{
					'expiredAt':{
						$exists: true,
						$gt:	new Date()
					}
				},
				{
					'expiredAt':{
						$exists:false
					}
				}
			]
		}).exec();
	}
};
