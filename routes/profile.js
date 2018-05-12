let express = require("express");
let router = express.Router();

let cookie = require('../api/cookie.js');

router.get('/', function(req, res, next) {

	//Check if user has logged in
	if(req.cookies.login === undefined || req.cookies.login === false){
        res.redirect("/login");
    } else {
        res.render('index', {});
    }
});

router.get('/manage', function(req, res, next){

	//Check if user has logged in
	if(req.cookies.login === undefined || req.cookies.login === false){
		res.redirect("/login");
	} else {
		res.render('index', {});
	}

});

router.get('/blog', function(req, res, next){

	//Check if user has logged in
	if(req.cookies.login === undefined || req.cookies.login === false){
		res.redirect("/login");
	} else {
		res.render('index', {});
	}
});

module.exports = router;
