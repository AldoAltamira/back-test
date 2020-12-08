'use strict'

const api = require('express').Router();
const users = require('../controllers/users');

module.exports = (()=>{
    api.get('/list',
       users.list
    )
    api.get('/customList',
        users.validUser, users.customList
    )
    api.post('/newUser',
        users.create
    )
    api.post('/login',
        users.login
    )
    api.delete('/remove/:id',
        users.validUser, users.delete
    )
    return api;
})();
