const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const sanitizer = require('sanitize')();
const logger = new console.Console(fs.createWriteStream('./logger.log'));

let suspendCount = 0;

app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
  res.render('pages/index');
});

app.post('/login', function (req, res) {
  try {
    let suspend = false;

    //  server side validation for user name
    if (req.body.username && req.body.username.length > 0) {
      req.body.username = req.body.username.replace(/\n\s\r\t/g, '');
    }

    //  server side validation for email
    if (req.body.email && req.body.email.length > 0) {
      req.body.email = req.body.username.replace(/\n\s\r\t/g, '');
    }

    const username = sanitizer.value(req.body.username, 'string');
    const email = sanitizer.value(req.body.email, 'string');
    const password = sanitizer.value(req.body.password, 'string');

    if (
      suspendCount < 2 &&
      req.body.email === 'admin@admin.com' &&
      req.body.password === 'admin123'
    ) {
      logger.log(`${new Date()}, Login: is sucess - ${username}`);
    }

    if (suspendCount >= 2 && req.body.email === 'admin@admin.com') {
      suspend = true;
      logger.log(`${new Date()}, Login: is suspended - ${username}`);
    }

    if (suspendCount < 2 && req.body.email === 'admin@admin.com') {
      suspendCount++;
    }

    res.render('pages/index');
  } catch (err) {
    logger.log('Error: ', err);
    throw err;
  }
});

app.listen(8080);
console.log('Server is listening on port 8080');
