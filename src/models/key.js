const Schema = require('mongoose').Schema;

exports.thisModelName = 'Key';
exports.enrich = {
	versioning: false,
	increment: true
};

exports.thisSchema = {
	title:{
		type: String,
		required: false,
		searchable: true,
		sortable: true,
		default: '',
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	key: {
		type: String,
		required: true,
		searchable: true,
		sortable: true,
		unique:true,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	owner: {
		type: Schema.Types.ObjectId,
		refPath: 'ownerModel',
		required: false,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	ownerModel: {
		type: String,
		required: false,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	crate:{
		type: Schema.Types.Mixed,
		required: true,
		default: {},
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	createdAt: {
		type: Date,
		default: Date.now,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	expiredAt: {
		type: Date,
		required: false,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
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
