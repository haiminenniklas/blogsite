let express = require('express');
let router = express.Router();

//Testing commit

router.get('/', function(req, res, next) {
    //user.createUser("TeamRaiderz", "22.2.2003", "The developer", "Niklas", "Haiminen", "Helsinki", "Finland", "salasana1234");
    res.render('index', { title: 'Express' });
});

module.exports = router;
