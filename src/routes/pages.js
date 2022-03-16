'use strict'

const api = require('express').Router();
const pages = require('../controllers/pages');

module.exports = (() => {
  api.get('/list',
    pages.list
  )
  api.get('/findPagesByTeam/:teamId',
    pages.findPagesByTeam
  )
  api.post('/newPage',
    pages.create
  )
  api.put('/update/:id',
    pages.update
  )
  api.delete('/remove/:id',
    pages.delete
  )
  api.get('/tstPage',
    pages.findPage
  )
  return api;
})();