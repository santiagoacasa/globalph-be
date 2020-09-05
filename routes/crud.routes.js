const express    = require('express');
const crudRoutes = express.Router();
const Photographer = require('../models/Photographer.model');
const { response } = require('express');

crudRoutes.get('/photographers', (req, res, next) => {
  console.log("search params", req.query)
  const searchParam = req.query.search || null
  if(searchParam === null){
    Photographer.find()
    .then(response => {
     return res.status(200).json(response)
    })
    .catch(err => console.log(err))
  } else {
    Photographer.find({skills: {$in:[searchParam]}}, {passwordHash: 0})
  .then(response => {
    console.log(response)
    res.status(200).json(response)
  })
  .catch(err => 
    console.log(err))
  }
  
})

module.exports = crudRoutes