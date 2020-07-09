/* global notFramework, document, confirm */
const ERROR_DEFAULT = 'Что пошло не так.';

import Common from '../common/index.js';

import Validators from '../common/validators.js';
import {
	Table as notTable,
	Breadcrumbs,
	UIError,
	Form
} from 'not-bulma';

const LABELS = {
	plural: 'Ключи',
	single: 'Ключ',
};

const BREADCRUMBS = [{
	title: LABELS.plural,
	url: '/keys'
}];

class ncKey extends notFramework.notController {
	constructor(app, params) {
		super(app);
		this.ui = {};
		this.els = {};
		this.setModuleName('key');
		this.setOptions('names', LABELS);
		this.setOptions('params', params);
		this.setOptions('role', 'root');
		this.log('keys interface');
		this.buildFrame();
		Breadcrumbs.setHead(BREADCRUMBS).render({
			root: app.getOptions('router:root'),
			target: this.els.top,
			navigate: (url) => app.getWorking('router').navigate(url)
		});
		this.route(params);
		return this;
	}


	setBreadcrumbs(tail) {
		Breadcrumbs.setTail(tail).update();
	}

	buildFrame() {
		let el = document.querySelector(this.app.getOptions('crud.containerSelector', 'body'));
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
		this.els.top = document.createElement('div');
		this.els.top.id = 'crud-top';
		this.els.top.classList.add('box');
		el.appendChild(this.els.top);
		this.els.main = document.createElement('div');
		this.els.main.id = 'crud-main';
		this.els.main.classList.add('box');
		el.appendChild(this.els.main);
		this.els.bottom = document.createElement('div');
		this.els.bottom.id = 'crud-bottom';
		this.els.bottom.classList.add('box');
		el.appendChild(this.els.bottom);
	}


	createDefault() {
		let t = new Date();
		t.setMonth(t.getMonth() + 1);
		let newRecord = this.make[this.getModuleName()]({
			'_id': null,
			key: '',
			title: LABELS.single,
			expiredAt: t.toISOString(),
			crate: JSON.stringify({})
		});
		return newRecord;
	}


	route(params = []) {
		if (params.length == 1) {
			if (params[0] === 'create') {
				return this.runCreate(params);
			} else {
				return this.runDetails(params);
			}
		} else if (params.length == 2) {
			if (params[1] === 'delete') {
				return this.runDelete(params);
			} else if (params[1] === 'update') {
				return this.runUpdate(params);
			} else {
				let routeRunnerName = 'run' + notFramework.notCommon.capitalizeFirstLetter(params[1]);
				if (this[routeRunnerName] && typeof this[routeRunnerName] === 'function') {
					return this[routeRunnerName](params);
				}
			}
		}
		return this.runList(params);
	}

	runCreate() {
		this.setBreadcrumbs([{
			title: 'Добавление нового',
			url: '/key/create'
		}]);
		if (this.ui.create) {
			return;
		} else {
			this.$destroyUI();
		}
		let manifest = this.app.getInterfaceManifest()[this.getModuleName()];
		this.ui.create = Form.build({
			target: this.els.main,
			manifest,
			action: 'create',
			options: {},
			validators: Validators,
			data: this.createDefault()
		});
		this.ui.create.$on('submit', (ev) => this.onCreateFormSubmit(ev.detail));
		this.ui.create.$on('reject', this.goList.bind(this));
	}

	runDetails(params) {
		this.setBreadcrumbs([{
			title: 'Просмотр опции',
			url: `/key/${params[0]}`
		}]);

		if (this.ui.details) {
			return;
		} else {
			this.$destroyUI();
		}
		let manifest = this.app.getInterfaceManifest()[this.getModuleName()];
		this.make.key({
			_id: params[0]
		}).$getRaw().then((res) => {
			if (res.status === 'ok') {
				this.ui.details = Form.build({
					target: this.els.main,
					manifest,
					action: 'get',
					options: {
						readonly: true
					},
					validators: Validators,
					data: notFramework.notCommon.stripProxy(res.result)
				});
			} else {
				this.ui.error = new UIError({
					target: this.els.main,
					props: {
						title: 'Произошла ошибка',
						message: res.error ? res.error : ERROR_DEFAULT
					}
				});
			}
		})
			.catch(this.error.bind(this));
	}

	runUpdate(params) {
		this.setBreadcrumbs([{
			title: 'Редактирование данных',
			url: `/key/${params[0]}/update`
		}]);

		if (this.ui.update) {
			return;
		} else {
			this.$destroyUI();
		}
		let manifest = this.app.getInterfaceManifest()[this.getModuleName()];
		this.make.key({
			_id: params[0]
		}).$getRaw().then((res) => {
			if (res.status === 'ok') {
				this.setBreadcrumbs([{
					title: `Редактирование данных ${res.result.id}`,
					url: `/key/${params[0]}/update`
				}]);

				this.ui.update = Form.build({
					target: this.els.main,
					manifest,
					action: 'update',
					options: {},
					validators: Validators,
					data: notFramework.notCommon.stripProxy(res.result)
				});

				this.ui.update.$on('submit', (ev) => {
					this.onUpdateFormSubmit(ev.detail);
				});

				this.ui.update.$on('reject', this.goList.bind(this));
			} else {
				this.ui.error = new UIError({
					target: this.els.main,
					props: {
						title: 'Произошла ошибка',
						message: res.error ? res.error : ERROR_DEFAULT
					}
				});
			}
		})
			.catch(this.error.bind(this));
	}

	runDelete(params) {
		this.setBreadcrumbs([{
			title: 'Удаление',
			url: `/key/${params[0]}/delete`
		}]);

		if (confirm('Удалить ключ?')) {
			this.make.key({
				_id: params[0]
			}).$delete()
				.then(() => {
					this.goList();
				})
				.catch((e) => {
					this.error(e);
					this.goList();
				});
		} else {
			this.goList();
		}
	}

	runList() {
		this.setBreadcrumbs([{
			title: 'Список',
			url: `/key`
		}]);

		if (this.ui.list) {
			return;
		} else {
			this.$destroyUI();
		}

		this.ui.list = new notTable({
			options: {
				targetEl: this.els.main,
				interface: {
					combined: true,
					factory: this.make.key
				},
				endless: false,
				preload: {},
				sorter: {
					id: -1
				},
				actions: [{
					title: 'Создать',
					action: this.goCreate.bind(this)
				}],
				fields: [{
					path: ':title',
					title: 'Название',
					searchable: true,
					sortable: true
				}, {
					path: ':key',
					title: 'Ключ',
					searchable: true,
					sortable: true
				}, {
					path: ':expiredAt',
					title: 'Истекает',
					sortable: true,
					searchable: true
				}, {
					path: ':_id',
					title: 'Действия',
					type: 'button',
					preprocessor: (value) => {
						return [{
							action: this.goDetails.bind(this, value),
							title: 'Подробнее',
							size: 'small'
						},
						{
							action: this.goUpdate.bind(this, value),
							title: 'Изменить',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							type: 'danger',
							title: 'Удалить',
							size: 'small',
							style: 'outlined'
						}
						];
					},
				}]
			}
		});
	}

	goCreate() {
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), 'create'].join('/'));
	}

	goDetails(value) {
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value].join('/'));
	}

	goUpdate(value) {
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value, 'update'].join('/'));
	}

	goDelete(value) {
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value, 'delete'].join('/'));
	}

	goList() {
		this.app.getWorking('router').navigate('/' + this.getModelURL());
	}

	onCreateFormSubmit(user) {
		this.ui.create.setLoading();
		this.make.key(user).$create()
			.then((res) => {
				this.log(res);
				this.showResult(this.ui.create, res);
				if (!Common.isError(res) && !res.error) {
					setTimeout(() => this.goList(this.app), 3000);
				}
			})
			.catch((e) => {
				this.showResult(this.ui.create, e);
			});
	}

	onUpdateFormSubmit(item) {
		this.ui.update.setLoading();
		this.make.key(item).$update()
			.then((res) => {
				this.showResult(this.ui.update, res);
				if (!Common.isError(res) && !res.error) {
					setTimeout(() => this.goList(this.app), 3000);
				}
			})
			.catch((e) => {
				this.showResult(this.ui.update, e);
			});
	}

	showResult(ui, res) {
		ui.resetLoading();
		if (Common.isError(res)) {
			notFramework.notCommon.report(res);
		} else {
			if (res.errors && Object.keys(res.errors).length > 0) {
				if (!Array.isArray(res.error)) {
					res.error = [];
				}
				Object.keys(res.errors).forEach((fieldName) => {
					ui.setFieldInvalid(fieldName, res.errors[fieldName]);
					res.error.push(...res.errors[fieldName]);
				});
			}
			if (res.error) {
				ui.setFormError(res.error);
			}
			if (!res.error) {
				ui.showSuccess();
			}
		}
	}


	$destroyUI() {
		for (let name in this.ui) {
			this.ui[name].$destroy && this.ui[name].$destroy();
			delete this.ui[name];
		}
	}

}

export default ncKey;


/*
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
							url: [this.getModelURL(), value, 'prolongForMonth'].join('/'),
							title: 'Продлить на месяц'
						},{
							url: [this.getModelURL(), value, 'update'].join('/'),
							title: 'Изменить'
						},{
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
*/
