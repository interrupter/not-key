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
				common: false,
				prefix: 'form-',
				postfix: '',
			},
			create: {
				preload: {},
				action: 'create',
				renderFromURL: false,
				name:'form-edit',
				prefix: 'form-',
				targetQuery: '#form-place',
				helpers: formHelpers
			},
			update: {
				preload: {},
				action: 'update',
				renderFromURL: false,
				name:'form-edit',
				prefix: 'form-',
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
				prefix: 'form-',
				postfix: '',
				endless: false,
				renderFromURL: false,
				name: 'list',
				common: false,
				preload: {},
				fields: [{
					path: ':id',
					title: 'ID',
					searchable: true,
					sortable: true
				}, {
					path: ':value',
					title: 'Value',
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
			key: this.getOptions('names.single'),
			value: '',
			active: true
		});
		return newRecord;
	}
}

export default ncKey;
