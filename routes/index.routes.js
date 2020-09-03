const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("En el home")
  if(!req.session.currentUser){
    res.status(200).json({message: "No hay un user logueado"})
    return
  }
  res.status(200).json({message: "Hi there"})
  
});

module.exports = router;
