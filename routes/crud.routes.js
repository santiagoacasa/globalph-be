const express    = require('express');
const crudRoutes = express.Router();
const Photographer = require('../../models/Photographer.model')

crudRoutes.get('/photographers', (req, res, next) => {
  Photographer.find()
})

module.exports = crudRoutes