const express = require('express');
const uploadRoutes = express.Router();
const uploadUserPic = require('../configs/cloudinaryProfilePics.config')
const uploadPortfolioPics = require('../configs/cloudinaryPortfolio.config')

uploadRoutes.post('/profilePic', uploadUserPic.single('profilePic'), async (req, res, next) => {
  if(!req.file) {
    next(new Error('No file to upload'));
    return;
  }
  res.status(200).json({profilePicUrl: req.file.path})
})

uploadRoutes.post('/portfolioPics', uploadPortfolioPics.array('portfolioPics', 10), async (req, res, next) => {
  if(!req.files) {
    next(new Error('No files to uplaod'));
    return;
  }
  console.log(req.files)
  res.status(200).json({portfolioPics: req.files})
})

module.exports = uploadRoutes;