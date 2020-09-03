const express    = require('express');
const authRoutes = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const Photographer = require('../../models/Photographer.model')
//const Consumer = require('../../models/Consumer.model')

authRoutes.post('/login', async (req, res, next) => {
  console.log('Dentro de ruta login')
  const {
    email,
    password
  } = req.body
  if (!email || !password) {
    res.status(400).json({message: "Please provide an email and password"})
    return;
  }
  try {
    user = await Photographer.findOne({email})
    console.log("Se esta logueando", user)
    if(!user){
      res.status(401).json({message: "This user does not exists"})
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      console.log("Usuario guardado en sesion", req.session.currentUser)
      res.status(200).json(req.session.currentUser)
    } else {
      res.status(400).json({message: "Incorrect password"})
      console.log("password erroneo")
    }
  } catch (error) {
    next(error)
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
  } = req.body.form;

  console.log(firstName, email, password)

  if (!email || !password) {
    console.log("No password or email")
    res.status(400).json({ message: 'Provide email and password' });
    return;
  }

  if(password.length < 8){
      res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
      return;
  }

  Photographer.findOne({ email }, (err, foundUser) => {
      if(err){
          res.status(500).json({message: "There was an error checking for the email."});
          return;
      }
      if (foundUser) {
        
          res.status(400).json({ message: 'Email taken. Choose another one.' });
          return;
      }
      const salt     = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newPhotographer = new Photographer({
          email:email,
          passwordHash: hashPass,
          firstName: firstName,
          lastName: lastName
      });
      console.log(newPhotographer)
      newPhotographer.save(err => {
          if (err) {
              res.status(400).json({ message: 'Saving user to database went wrong.' });
              console.log(err)
              return;
          }
          // Automatically log in user after sign up
          // .login() here is actually predefined passport method
          req.login(newPhotographer, (err) => {
              if (err) {
                  res.status(500).json({ message: 'Login after signup went bad.' });
                  return;
              }
              // Send the user's information to the frontend
              // We can use also: res.status(200).json(req.user);
              res.status(200).json(newPhotographer);
              console.log("El usuario esta logueado con exito")
          });
      });
  });
});

authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});



module.exports = authRoutes;