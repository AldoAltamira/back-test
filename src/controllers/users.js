'use strict'

const mongoose = require('mongoose');
const Users = require('../models/users');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const secretJWT = process.env.secretJWT ? process.env.secretJWT : 'HolaMundo';

exports.create = (req,res) => {
  let newUser = new Users(req.body);
  newUser.save((err, resp) => {
    if (err) {
      res.status(500).send({
        message: 'Ha ocurrido un error interno',
        errorMessage: err,
      })
    } else {
      var tokenData = {
        cool: true
      }
      var token = jwt.sign(tokenData, secretJWT, {
         expiresIn: 60 * 60 * 24 // expires in 24 hours
      });
      console.log('resp', resp);
      res.status(200).send({
        status: 'success',
        code: 200,
        data: resp,
        token: token,
        message: 'success'
      })
    }
  });
}

exports.list = (req,res) => {
  let search = req.query.search ? req.query.search : '';
  Users.find({ $or: [{name: {$regex: `.*${search}.*`, $options: 'i'}}, {hobby: {$regex: `.*${search}.*`, $options: 'i'}}] },(err,resp) => {
    if(err) {
      console.log('entro a error', err);
      res.status(500).send({
        message: 'Ha ocurrido un error interno',
        errorMessage: err,
      })
    } else {
      res.status(200).send({
        status: 'success',
        code: 200,
        data: resp,
        message: 'success'
      });
    }
  })
}

exports.customList = (req,res) => {
  let dateCondition = new Date();
  dateCondition.setDate(dateCondition.getDate() - 3);
  Users.aggregate(
    [
      {
        $match: {age: { $gte: 18 }, gender: 'Male', createdDate: {$gte: new Date(dateCondition)}}
      },
      {
        $group : {_id : "$hobby", users: { $push: "$$ROOT" }}
      }
    ],(err,resp) => {
    if(err) {
      console.log('entro a error', err);
      res.status(500).send({
        message: 'Ha ocurrido un error interno',
        errorMessage: err,
      })
    } else {
      res.status(200).send({
        status: 'success',
        code: 200,
        data: resp,
        message: 'success'
      });
    }
  });
}

exports.login = (req, res) => {
  console.log('body', req.body);
  if (req.body.email && req.body.password) {
    Users.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
        if (err) {
          res.status(500).send({
            message: 'Ha ocurrido un error interno',
            errorMessage: err,
          })
        } else {
          res.status(400).send({
            message: 'No se encontro el usuario',
          })
        }
      } else {
        console.log('user', user.validatePassword);
        user.comparePassword(req.body.password, function(errPassword, isMatch) {
          console.log('isMatch', isMatch);
          console.log('errPassword', errPassword);
          if (errPassword) {
            res.status(500).send({
              message: 'Ha ocurrido un error interno',
              errorMessage: errPassword,
            })
          } else {
            if (isMatch) {
              var tokenData = {
                cool: true
              }
              var token = jwt.sign(tokenData, secretJWT, {
                 expiresIn: 60 * 60 * 24 // expires in 24 hours
              })
              res.status(200).send({
                status: 'success',
                code: 200,
                data: token,
                message: 'success'
              });
            } else {
              res.status(400).send({
                message: 'La contraseña es invalida',
              })
            }
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'No se enviaron las credenciales correctamente',
    })
  }
}

exports.validUser = (req, res, next) => {
  var token = req.headers['authorization'];
  if(!token){
    res.status(401).send({
      message: "Es necesario el token de autenticación"
    });
  } else {
    token = token.replace('Bearer ', '')
    jwt.verify(token, secretJWT, function(err, user) {
      if (err) {
        res.status(401).send({
          message: 'Token inválido',
          errorMessage: err,
        })
      } else {
        next();
      }
    })
  }
}

exports.delete = (req, res) => {
  if (req.params.id) {
    Users.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) {
        res.status(500).send({
          message: 'Ha ocurrido un error interno',
          errorMessage: err,
        })
      } else if (!user) {
        res.status(400).send({
          message: 'No se encontro el usuario que se desea eliminar',
        })
      } else {
        res.status(200).send({
          status: 'success',
          code: 200,
          message: 'success'
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'No se envio el parametro',
    })
  }
}
