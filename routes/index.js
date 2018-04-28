var express = require('express');
var router = express.Router();

const user = require("../api/user.js");

router.get('/', function(req, res, next) {
    //user.createUser("TeamRaiderz", "22.2.2003", "The developer", "Niklas", "Haiminen", "Helsinki", "Finland", "salasana1234");
    res.render('index', { title: 'Express' });
});

module.exports = router;
