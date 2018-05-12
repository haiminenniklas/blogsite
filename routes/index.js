import express from 'express';
let router = express.Router();
import { Cookie } from "../api/cookie.js";

router.get('/', function(req, res, next) {

	let cookie = new Cookie(req, res);

    if(req.cookies.login === undefined || req.cookies.login === false){
		if(req.cookies.rememberMe !== undefined){
			cookie.setCookie("login", req.cookies.rememberMe, 1);
			let id = req.cookies.rememberMe.split(';')[1];
			res.render('index', {id: id});
		} else {
        	res.redirect("/login");
		}
    } else {
		let id = req.cookies.login.split(';')[1];
		res.render('index', {id: id});
    }

});

router.get('/browse', function(req, res, next){
	res.redirect('/');
});

module.exports = router;
