const express = require('express');
const crudRoutes = express.Router();
const Photographer = require('../models/Photographer.model');
const uploadUserPic = require('../configs/cloudinaryProfilePics.config')


crudRoutes.get('/photographers', (req, res, next) => {
  const searchParam = req.query.search || null
  if (searchParam === null) {
    Photographer.find()
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Something went wrong searching for users, please try again later."})
      })
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
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Something went wrong searching for users, please try again later."})
      })     
  }
})

crudRoutes.patch('/updateProfile', async (req, res, next) => {
  console.log(req.body)
  const {_id: userId } = req.session.currentUser
  try {
    updatedUser = await Photographer.findByIdAndUpdate({_id: userId}, req.body, {new: true})
    req.session.currentUser = updatedUser
    res.status(200).json({
      message: "User successfully updated",
      updatedUser: updatedUser})
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something went wrong updating the user, please try again later."})
  }
})

module.exports = crudRoutes