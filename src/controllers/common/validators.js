export default {
	fields:{
		_id(){return [];},
		title(){return [];},
		key(){return [];},
		keyID(){return [];},
		crate(){return [];},
		createdAt(){return [];},
		updatedAt(){return [];},
		expiredAt(){return [];}
	},
	form:{
		edit(){
			return {
				clean: true
			};
		}
	}
};
