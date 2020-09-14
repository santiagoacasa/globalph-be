const Photographer = require('../models/Photographer.model')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs'); 
const passport      = require('passport');

passport.serializeUser((loggedInUser, cb) => {
  console.log("serialize")
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  console.log("deserialize")
  Photographer.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    console.log("User", userDocument)
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password'
}, (username, password, next) => {
  Photographer.findOne({ username }, (err, foundUser) => {
    console.log("Searching for the user!")
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      console.log("Usuario a buscar", username)
      console.log("usuario no encontrado")
      next(null, false, { message: 'Incorrect username.' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password.' });
      return;
    }
    next(null, foundUser);
  });
}));
