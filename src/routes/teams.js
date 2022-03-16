'use strict'

const api = require('express').Router();
const teams = require('../controllers/teams');

module.exports = (()=>{
    api.get('/list',
       teams.list
    )
    api.post('/newTeam',
      teams.create
    )
    api.put('/update/:id',
      teams.update
    )
    api.delete('/remove/:id',
      teams.delete
    )
    return api;
})();
