let express = require("express");
let router = express.Router();

let cookie = require('../api/cookie.js');

import * as users from "../api/user.js";

router.get('/', function(req, res, next) {

	//Check if user has logged in
	if(req.cookies.login === undefined || req.cookies.login === false){
        res.redirect("/login");
    } else {
	    let id = req.cookies.login.split(';')[1];
	    let user = users.getUser(id, function(user){
	        if(user !== null || user !== undefined){
                res.render('profile/profile', {user: user});
            } else {
	            res.redirect('/');
            }
        });
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
