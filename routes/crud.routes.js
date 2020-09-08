const express = require('express');
const crudRoutes = express.Router();
const Photographer = require('../models/Photographer.model');
const {
  response
} = require('express');

crudRoutes.get('/photographers', (req, res, next) => {
  const searchParam = req.query.search || null
  if (searchParam === null) {
    Photographer.find()
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => console.log(err))
  } else {
    Photographer.find({
        skills: {
          $in: [searchParam]
        }
      }, {
        passwordHash: 0
      })
      .then(response => {
        console.log(response)
        res.status(200).json(response)
      })
      .catch(err =>
        console.log(err))
  }
})

crudRoutes.patch('/updateProfile', async (req, res, next) => {
  console.log(req.body)
  try {
    updatedUser = await Photographer.findByIdAndUpdate({_id: req.body.id}, req.body, {new: true})
    req.session.currentUser = updatedUser
    res.status(200).json({
      message: "User successfully updated",
      updatedUser: updatedUser})
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something went wrong updating the user"})
  }
})

module.exports = crudRoutes