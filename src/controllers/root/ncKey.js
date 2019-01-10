/* global notFramework */

class ncKey extends notFramework.CRUDController {
	constructor(app, params) {
		super(app);
		this.setModuleName('key');
		this.setOptions('names', {
			plural: 'Ключи',
			single: 'Ключ',
		});
		this.setOptions('params', params);
		this.setOptions('role', 'admin');
		this.setOptions('containerSelector', this.app.getOptions('crud.containerSelector'));
		this.log('keys interface');
		let formHelpers = {};
		this.setOptions('views', {
			default:{
				renderFromURL: false,
				postfix: '',
				name: 'content-list',
				common: false
			},
			create: {
				preload: {},
				prefix: 'form-',
				postfix: '',
				action: 'create',
				renderFromURL: false,
				name:'content-edit',
				targetQuery: '#form-place',
				helpers: formHelpers
			},
			update: {
				preload: {},
				postfix: '',
				prefix: 'form-',
				action: 'update',
				renderFromURL: false,
				name:'content-edit',
				targetQuery: '#form-place',
				helpers: formHelpers
			},
			list: {
				interface:	{
					combined:	true
				},
				helpers:{
					createURL: [this.getModelURL(),'create'].join('/')
				},
				targetQuery: '#table-place',
				prefix: 'content-',
				postfix: '',
				endless: false,
				renderFromURL: false,
				common: false,
				preload: {},
				fields: [{
					path: ':title',
					title: 'Title',
					searchable: true,
					sortable: true
				},{
					path: ':key',
					title: 'KEY',
					searchable: true,
					sortable: true
				}, {
					path: ':expiredAt',
					title: 'Valid till',
					sortable: true,
					searchable: true
				}, {
					path: ':_id',
					title: 'Действия',
					preprocessor: (value) => {
						return {
							links:[
								{
									url: [this.getModelURL(), value, 'update'].join('/'),
									title: 'Изменить'
								},
								{
									url: [this.getModelURL(), value, 'delete'].join('/'),
									title: 'Удалить'
								}
							]
						};
					},
					component: {
						template: {
							name: 'links'
						}
					}
				}]
			}
		});
		this.route(params);
		return this;
	}
	initItem() {
		let newRecord = this.make[this.getModuleName()]({
			'_id': null,
			key: '',
			title: 'Ключ',
			crate: JSON.stringify({})
		});
		return newRecord;
	}
}

export default ncKey;
