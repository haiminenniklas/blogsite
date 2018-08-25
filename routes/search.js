let express = require("express");
let router = express.Router();

router.get('/', function(req, res, next){
    if(req.cookies.login === undefined || req.cookies.login === false){
        res.redirect("/login");
    } else {
        res.redirect('/');
    }
});

router.post('/', function(req, res, next){
    if(req.body.type === "search"){

        let searchQuery = req.body.query;
        console.log(searchQuery);
        res.redirect('/');

    } else {
        res.redirect('/');
    }
});

module.exports = router;