var express = require('express');
var weather = require('weather-js');
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  weather.find({search: 'Toronto, ON, Canada', degreeType: 'C'}, function (err, result) {
    if (err) {
      throw err;
    }

    var current = result[0].current;

    res.render('index', {
      title: 'Weather Toronto',
      date: moment(current.date, 'YYYY-MM-DD').format('dddd MMMM Do YYYY'),
      temp: current.temperature
    });
  });
});

module.exports = router;
