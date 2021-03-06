const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Photographer = require('../../models/Photographer.model')
const Consumer = require('../../models/Consumer.model')

authRoutes.post('/login', async (req, res, next) => {
  console.log('Dentro de ruta login')
  const {
    email,
    password,
    isPhotographer
  } = req.body
  console.table(req.body)
  if (!email || !password) {
    res.status(400).json({ errorMessage: "Please provide an email and password" })
    return;
  }
  if(isPhotographer){
    try {
      user = await Photographer.findOne({ email })
      console.log("Se esta logueando", user)
      if (!user) {
        res.status(401).json({ errorMessage: "This user does not exists" })
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        console.log("Usuario guardado en sesion", req.session.currentUser)
        res.status(200).json(req.session.currentUser)
      } else {
        res.status(400).json({ errorMessage: "Incorrect password" })
        console.log("password erroneo")
      }
  } catch (error) {
    next(error)
  } 
  }else {
    try {
      user = await Consumer.findOne({ email })
      console.log("Se esta logueando", user)
      if (!user) {
        res.status(401).json({ errorMessage: "This user does not exists" })
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        console.log("Usuario guardado en sesion", req.session.currentUser)
        res.status(200).json(req.session.currentUser)
      } else {
        res.status(400).json({ errorMessage: "Incorrect password" })
        console.log("password erroneo")
      }
  } catch (error) {
    next(error)
  } 
  } 

});

authRoutes.post('/signup', (req, res, next) => {
  console.log("llamada al signup")
  console.log(req.body.form)
  const {
    email,
    firstName,
    lastName,
    password,
    isPhotographer
  } = req.body.form;

  console.log(firstName, email, password)

  if (!email || !password) {
    console.log("No password or email")
    res.status(400).json({ errorMessage: 'Provide email and password' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.status(400).json({ errorMessage: "The password should be at least 8 characters long and must contain lower and uppercase letters." });
    return;
  }
  if (isPhotographer) {
    Photographer.findOne({ email }, (err, foundUser) => {
      if (err) {
        res.status(500).json({ errorMessage: "There was an error checking for the email." });
        return;
      }
      if (foundUser) {

        res.status(400).json({ errorMessage: 'Email taken. Choose another one.' });
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newPhotographer = new Photographer({
        email: email,
        passwordHash: hashPass,
        firstName: firstName,
        lastName: lastName,
        isPhotographer: isPhotographer
      });
      console.log(newPhotographer)
      newPhotographer.save(err => {
        if (err) {
          res.status(400).json({ errorMessage: 'Saving user to database went wrong.' });
          console.log(err)
          return;
        }
        // Automatically log in user after sign up
        // .login() here is actually predefined passport method
        req.login(newPhotographer, (err) => {
          if (err) {
            res.status(500).json({ errorMessage: 'Login after signup went bad.' });
            return;
          }
          // Send the user's information to the frontend
          // We can use also: res.status(200).json(req.user);
          req.session.currentUser = newPhotographer;
          res.status(200).json(newPhotographer);
          console.log("El usuario esta logueado con exito")
        });
      });
    });
  } else {
    Consumer.findOne({ email }, (err, foundUser) => {
      if (err) {
        res.status(500).json({ errorMessage: "There was an error checking for the email." });
        return;
      }
      if (foundUser) {

        res.status(400).json({ errorMessage: 'Email taken. Choose another one.' });
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new Consumer({
        email: email,
        passwordHash: hashPass,
        firstName: firstName,
        lastName: lastName
      });
      console.log(newUser)
      newUser.save(err => {
        if (err) {
          res.status(400).json({ errorMessage: 'Saving user to database went wrong.' });
          console.log(err)
          return;
        }
        // Automatically log in user after sign up
        // .login() here is actually predefined passport method
        req.login(newUser, (err) => {
          if (err) {
            res.status(500).json({ errorMessage: 'Login after signup went bad.' });
            return;
          }
          // Send the user's information to the frontend
          // We can use also: res.status(200).json(req.user);
          req.session.currentUser = newUser;
          res.status(200).json(newUser);
          console.log("El usuario esta logueado con exito")
        });
      });
    });
  }

});

authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  req.session.destroy();
  res.status(200).json({ message: 'Log out successfull!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ errorMessage: 'Unauthorized' });
});



module.exports = authRoutes;