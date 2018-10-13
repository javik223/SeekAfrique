const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const fs = require('fs');
const morgan = require('morgan');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const signup = require('./signup');

require('dotenv').config();

const port = process.env.NODE_PORT || 80

const map = fs.readFileSync(__dirname + "/assets/img/map.svg", {
  encoding: 'utf-8'
});



// Enable CSRF protection
const csrfProtection = csrf({
  cookie: true
})

const parseForm = bodyParser.urlencoded({
  extended: false
})

app.set('view engine', 'pug');

app.use(morgan(process.env.MORGAN_FORMAT || tiny));
app.use(cookieParser("i18n_seekafrique"));
app.use(session({
  secret: "i18n_seekafrique",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));

i18n.configure({

  //define how many languages we would support in our application
  locales: ['en', 'fr'],

  //define the path to language json files, default is /locales
  directory: __dirname + '/i18n',

  //define the default language
  // defaultLocale: 'fr',

  // define a custom cookie name to parse locale settings from
  cookie: 'i18n'
});

//init i18n after cookie-parser
app.use(i18n.init);

// Checks the state of the i18n cookie
// if it is not available and the user browser
// accepts French language, make the default language
// French
app.use((req, res, next) => {
  const i18nCookieExist = req.headers['cookie'] && req.headers['cookie'].indexOf("i18n=") != -1
  const acceptsFrench = req.headers['accept-language'].indexOf("fr") != -1
  if (!i18nCookieExist && acceptsFrench) {
    req.setLocale('fr')
  }
  next()
})


app.use('/assets', express.static("./assets/"));

app.get('/', csrfProtection, function (req, res) {
  res.render('index', {
    __: res.__,
    csrfToken: req.csrfToken(),
    map
  })
});

app.get('/fr', function (req, res) {
  res.cookie('i18n', 'fr');
  res.redirect('/')
});

app.get('/en', function (req, res) {
  res.cookie('i18n', 'en');
  res.redirect('/')
});

app.post('/process', parseForm, csrfProtection, function (req, res) {
  try {
    const User = new signup({
      name: req.body.name,
      email: req.body.email,
      nationality: req.body.nationality,
      locale: req.locale
    });
    User.create()
    User.emailOrganisation()
    User.emailRecipient(res.__)
    res.json({
      success: true,
      message: res.__('Message successful')
    })
  } catch (err) {
    res.json({
      success: false,
      message: `${err}`
    })
  }
})

app.listen(port);