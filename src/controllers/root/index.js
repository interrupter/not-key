import ncKey from './ncKey.js';

let manifest = {
	router: {
		manifest: [
			{
				paths: ['key\/([^\/]+)\/([^\/]+)', 'key\/([^\/]+)', 'key'],
				controller: ncKey
			},
		]
	},
	menu:[{
		title: 	'Ключи',
		url: 	'/key'
	}]
};

export {
	manifest,
	ncKey
};
