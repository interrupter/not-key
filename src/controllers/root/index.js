import ncKey from './ncKey.js';

let manifest = {
	router: {
		manifest: [
			ncKey.getRoutes()
		]
	},
	menu:{
		side: {
			items: [{
				id: 			'system.keys',
				section: 'system',
				title: 		'Ключи',
				url: 			'/key'
			}]
		}
	}
};

import UIListOfUrls from '../lib/UIListOfURLs.svelte';
import UIJSON from '../lib/UIJSON.svelte';
const uis = {UIListOfUrls, UIJSON};

export {
	manifest,
	uis,
	ncKey
};
