const Schema = require('mongoose').Schema;

exports.thisModelName = 'Key';
exports.enrich = {
	versioning: false,
	increment: true
};

exports.thisSchema = {
	key: {
		type: String,
		required: true,
		searchable: true,
		sortable: true,
		unique:true
	},
	owner: {
		type: Schema.Types.ObjectId,
		refPath: 'ownerModel',
		required: false
	},
	ownerModel: {
		type: String,
		required: false
	},
	crate:{
		type: Schema.Types.Mixed,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	expiredAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
};

exports.thisVirtuals = {};
exports.thisMethods = {};

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
};
