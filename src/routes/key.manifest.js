const FIELDS = require('../common/fields.js');

module.exports = {
  model: 'key',
  url: '/api/:modelName',
  fields: FIELDS,
  actions: {
    create: {
      method: 'PUT',
      isArray: false,
      data: ['record'],
      rules: [{
        admin: true,
        fields: ['title', 'key', 'crate', 'expiredAt']
      }],
      title: 'Creation of new key'
    },
    collect: {
      method: 'PUT',
      postFix: '/:actionName',
      isArray: false,
      data: ['record'],
      rules: [{
          auth: false
        },
        {
          auth: true
        },
        {
          admin: true
        }
      ]
    },
    update: {
      method: 'POST',
      isArray: false,
      postFix: '/:record[_id]/update',
      data: ['record'],
      auth: true,
      admin: true,
      title: 'Update of a key',
      fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt']
    },
    listAndCount: {
      method: 'GET',
      isArray: false,
      postFix: '/:actionName',
      data: ['pager', 'sorter', 'filter', 'searcher', 'return'],
      fields: ['_id', 'keyID', 'title', 'key', 'crate', 'expiredAt'],
      rules: [{
        auth: true,
        role: ['admin']
      }, {
        auth: true,
        admin: true
      }]
    },
    latest: {
      method: 'GET',
      isArray: true,
      postFix: '/:actionName',
      data: [],
      fields: ['_id', 'title', 'key', 'crate', 'expiredAt'],
      rules: [{
        auth: true,
        admin: true
      }]
    },
    get: {
      method: 'GET',
      isArray: false,
      postFix: '/:record[_id]',
      data: [],
      rules: [{
        auth: true,
        admin: true
      }]
    },
    getRaw: {
      method: 'GET',
      isArray: false,
      postFix: '/:record[_id]/:actionName',
      data: [],
      rules: [{
        auth: true,
        admin: true
      }]
    },
    delete: {
      method: 'DELETE',
      postFix: '/:record[_id]',
      isArray: false,
      rules: [{
        auth: true,
        admin: true
      }]
    }
  }
};
