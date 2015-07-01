var express = require('express');
var router = express.Router();
var archiver = require('../archiver.js');

setInterval(function () {
  console.log(require('util').inspect(process.memoryUsage()));
}, 1000);

/* GET home page. */

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/download/:size', function (req, res) {
  archiver.getZip(req.params.size).then(function(response) {
    response.pipe(res);
  });
});

module.exports = router;
