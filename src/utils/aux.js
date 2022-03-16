const auxPage = {
  "id": 2,
  "type": "",
  "team": "nombre-del-team",
  "pages": {
    "slug": "devoluciones",
    "title": "Devoluciones Offline",
    "ui_components": [{
      "ui_type": "container",
      "className": "row",
      "elements": [{
          "ui_type": "container",
          "className": "col-md-6 d-flex flex-column gap-3 p-5",
          "elements": [{
            "ui_type": "container",
            "dependencies": [{
              "type": "fetch",
              "url": "https://jsonplaceholder.typicode.com/todos",
              method: 'get',
              "location_data": "data",
              "template": {
                "ui_type": "container",
                "type": "form",
                "className": "d-flex flex-row gap-3",
                "elements": [{
                    "ui_type": "input",
                    "name": "name",
                    "className": "col-6",
                    "value": "name",
                    dataKey: 'title',
                  },
                  {
                    "ui_type": "button",
                    "className": "btn btn-success col-3",
                    "value": "Editar",
                    "event": {
                      "type": "onClick",
                      "body": {
                        "name": "$data.name"
                      },
                      "action": 123
                    },
                    "action": {
                      "id": 123,
                      "type": "fetch",
                      "method": "post",
                      "url": "https://jsonplaceholder.typicode.com/users",
                      "body_template": {
                        "name": "body.name"
                      }
                    }
                  },
                  {
                    "ui_type": "button",
                    "className": "btn btn-danger col-3",
                    "value": "Borrar"
                  }
                ]
              }
            }],
          }]
        },
        {
          "ui_type": "container",
          "className": "col-md-6 d-flex flex-column gap-3 p-5",
          "elements": [{
              "ui_type": "title",
              "className": "fs-6 m-0",
              "value": "Crear nueva nota"
            },
            {
              "ui_type": "input",
              "className": "",
              "placeholder": "Ingrese un nombre"
            },
            {
              "ui_type": "button",
              "className": "btn btn-info",
              "value": "Submit"
            }
          ]
        }
      ]
    }]
  }
}

module.exports = auxPage;