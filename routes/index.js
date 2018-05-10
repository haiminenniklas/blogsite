let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {

    if(req.cookies.login === undefined || req.cookies.login === false){
        res.redirect("/login");
    } else {
        res.render('index', {});
    }

});

module.exports = router;
