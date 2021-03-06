require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session       = require('express-session');
const passport      = require('passport');
const cors         = require('cors');
require('./configs/passport');



//require DB configuration
require('./configs/db.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//CORSs
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001', process.env.DEPLOYEDHTTPSURL, process.env.DEPLOYEDHTTPURL] // <== aceptar llamadas desde este dominio
  })
);

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(express.static(path.join(__dirname, "build")));

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//require Session configuration
require('./configs/session.config')(app);
//PASSPORT INITIALIZE Y SESSION
app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Global PH';

const crudRoutes = require('./routes/crud.routes')
const index = require('./routes/index.routes');
const authRoutes = require('./routes/auth/auth.routes');
const uploadRoutes = require('./routes/file-upload.routes')
app.use('/crud', crudRoutes);
app.use('/', index);
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes)



module.exports = app;
