const fs = require('fs')
const path = require('path')
const knex = require('../config/database')

const getModelFiles = (dir) => fs.readdirSync(dir)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .map(file => path.join(dir, file))

const files = getModelFiles(__dirname)

const models = files.reduce((modelsObj, filename) => {
  const initModel = require(filename)
  const model = initModel(knex)

  if(model) modelsObj[model.name] = model

  return modelsObj
}, {})

module.exports = models