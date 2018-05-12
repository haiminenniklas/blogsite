let express = require("express");
let router = express();
let util = require("../api/util");
let mysql = require("../api/mysql");
let cookieapi = require("../api/cookie");
let userapi = require("../api/user");

router.get('/', function(req, res, next){
    res.render('login', {});

});

router.get('/logout', function(req, res, next){

    //Logs the user our

    let cookie = new cookieapi.Cookie(req, res);

    //If login cookie is not set, send them to the login page
    if(req.cookies.login === undefined || req.cookies.login === false){
        res.redirect('/login');
    } else {
        //Delete the login cookie and send the user to the login page
        cookie.deleteCookie("login");

        //If user has activated remember me, remove the cookie that nobody can login with that account again
        if(req.cookies.rememberMe !== undefined){
            cookie.deleteCookie("rememberMe");
        }

        res.redirect('/login');
    }

});

router.post('/', function(req, res, next){

    let cookie = new cookieapi.Cookie(req, res);

    //Check whether the user wants to login or register
    if(req.body.type === "login"){

        //Login code....

        let password = req.body.password;
        let username = req.body.username;

		let sql = `SELECT id,password FROM users WHERE username = '${username}';`;
		mysql.execQuery(sql, (error, results, fields) => {

			if(error){
				res.send("Error when logging in, please try again later!");
			} else {
				for(let i = 0; i < results.length; i++){
					let user = results[i];
					util.checkPassword(password, user.password, function(result){
						  if(result){
							  //If user wanted the system to remember his/her login
  							  if(req.body.rememberMe !== undefined){
  								  //Set the remember cookie to expire in two months
  								  cookie.setCookie("rememberMe", "true;" + user.id, 61);
  							  }
							  cookie.setCookie("login", "true;" + user.id, 1);
							  res.redirect("/");
						  }  else {
							  res.redirect("/login");
						  }
					});

				}
			}

		});

    } else if (req.body.type === "register"){

        //Registration code...

        let username = req.body.username;
        let birthdate = req.body.birthdate;
        let joinDate = util.getToday();
        let description = "";

        if(req.body.description !== undefined){
            description = req.body.description;
        }

        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let city = req.body.city;
        let country = req.body.country;

        let password = req.body.password;

        userapi.createUser(username, birthdate, description, firstName, lastName, city, country, password, function(error){
           if(error){
               res.send("Error when registering! Please try again later!");
           } else {
               res.redirect('/login');
           }
        });

    }

});

router.get('/register', function(req, res, next){
    res.render('register', {});
});

module.exports = router;
