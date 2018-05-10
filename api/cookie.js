let cookieparser = require("cookie-parser");

let Cookie = function Cookie(req, res){


    //Getters and setters
    this.request = req;
    this.getRequest = () => { return this.request; };
    this.response = res;
    this.getResponse = () => { return this.response; };

    //Clears a cookie with given name
    this.deleteCookie = function(cname) {
        this.response.clearCookie(cname);
    };

    //Sets a cookie with given name, value and days until expiration
    this.setCookie = function(cname, cvalue, cexpiration) {

        let expiration = {};

        if(cexpiration != null){
            //Setting the real expiration
            let d = new Date();
            d.setTime(d.getTime() + (cexpiration * 24 * 60 * 60 * 1000));
            let time = d.getTime();
            expiration = { expire: time };
        }

        //Setting the cookie value
        this.response.cookie(cname, cvalue, expiration);

    }


};

module.exports.Cookie = Cookie;
