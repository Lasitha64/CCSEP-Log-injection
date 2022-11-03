const express = require('express');
router = express.Router();

app.get('/', function (req, res) {
  res.render('pages/index');
});

router.post('/login', (req, res) => {
  console.log(req.body);
});

module.exports = router;
