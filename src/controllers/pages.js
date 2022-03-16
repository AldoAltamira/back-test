'use strict'
const Pages = require('../models/pages');
const auxPage = require('../utils/aux');
const axios = require('axios');

exports.create = (req, res) => {
  let newPage = new Pages(req.body);
  console.log('newPage', newPage);
  newPage.save((err, resp) => {
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

exports.findPagesByTeam = (req, res) => {
  let teamId = req.params.teamId;
  Pages.find({
    team: teamId
  }, (err, resp) => {
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

exports.list = (req, res) => {
  let search = req.query.search ? req.query.search : '';
  Pages.find({
    $or: [{
      name: {
        $regex: `.*${search}.*`,
        $options: 'i'
      }
    }]
  }, (err, resp) => {
    if (err) {
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
  Pages.findByIdAndUpdate(id, update, (err, resp) => {
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
    Pages.findByIdAndRemove(req.params.id, (err, page) => {
      if (err) {
        res.status(500).send({
          message: 'Ha ocurrido un error interno',
          errorMessage: err,
        })
      } else if (!page) {
        res.status(400).send({
          message: 'No se encontro el page que se desea eliminar',
        })
      } else {
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

exports.findPage = async (req, res) => {
  try {
    let page = await fillElement(auxPage.pages.ui_components[0]);
    res.status(200).send({
      status: 'success',
      code: 200,
      data: page,
    });
  } catch (e) {
    res.status(500).send({
      message: 'Ha ocurrido un error interno',
      errorMessage: e,
    });
  }
}

const findValueInObj = (obj, path) => {
  let value = obj;
  path.split('.').forEach(p => {
    value = obj[p];
  });
  return value;
}

const createElementsTemplate = (template, data) => {
  let el = [];
  data.forEach((d, i) => {
    let elements = []
    template.elements.forEach((e) => {
      if (e.dataKey) {
        e.value = d[e.dataKey];
        e.ind = i;
      }
      elements.push({
        ...e
      });
    });
    el.push(elements);
  });
  return el;
}

const fillElement = async (data) => {
  try {
    const newElements = data.elements.map(async (element) => {
      if (element.dependencies && element.dependencies.length > 0) {
        for await (const dependency of element.dependencies) {
          if (dependency.type === 'fetch') {
            const fetchResponse = await axios[dependency.method](dependency.url);
            const fetchData = findValueInObj(fetchResponse, dependency.location_data);
            const elementsTemplate = createElementsTemplate(dependency.template, fetchData);
            element.elements = elementsTemplate;
          }
        };
        delete element.dependencies;
      }
      if (element.elements) {
        if (element.elements.length > 0) {
          element.elements = await fillElement(element);
        }
      }
      return element;
    });
    return await Promise.all(newElements);
  } catch (err) {
    console.log('error', err);
    return null;
  }
}

// (async () => {
//   try {
//     const page = await fillElement(auxPage.pages.ui_components[0]);
//     console.log('page', page);
//   } catch (e) {
//     console.log('error', e);
//   }
// })();