'use strict'
const Teams = require('../models/teams');

exports.create = (req,res) => {
  let newTeam = new Teams(req.body);
  console.log('newTeam', newTeam);
  newTeam.save((err, resp) => {
    console.log('err', err);
    if (err) {
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
      })
    }
  });
}

exports.list = (req,res) => {
  let search = req.query.search ? req.query.search : '';
  Teams.find({ $or: [{name: {$regex: `.*${search}.*`, $options: 'i'}}] },(err,resp) => {
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

exports.update = (req, res) => {
  let id = req.params.id;
  let update = req.body;
  Teams.findByIdAndUpdate(id, update, (err, resp) => {
    if (err) {
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
      })
    }
  });
}

exports.delete = (req, res) => {
  if (req.params.id) {
    Teams.findByIdAndRemove(req.params.id, (err, team) => {
      if (err) {
        res.status(500).send({
          message: 'Ha ocurrido un error interno',
          errorMessage: err,
        })
      } else if (!team) {
        res.status(400).send({
          message: 'No se encontro el team que se desea eliminar',
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
