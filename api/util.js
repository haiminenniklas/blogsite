const bcrypt = require("bcrypt");
const mysql = require("./mysql.js");

let hash = function(plainPassword, callback){

    bcrypt.hash(plainPassword, 10, (err, hash) => {
       if(err){
           callback(false, null);
       } else {
           callback(true, hash);
       }
    });

};

let checkPassword = function(password, hash, callback){
  bcrypt.compare(password, hash, (err, res) => {
      if(err){
          callback(false);
      } else {
          callback(res);
      }
  });
};

let getToday = function(){
    let today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd < 10){
        dd = '0' + dd;
    }

    if(mm < 10){
        mm = '0' + mm;
    }

    return `${dd}.${mm}.${yyyy}`;

};

let hasSpaces = function(str){
  return /^ *$/.test(str);
};

module.exports.getToday = getToday;
module.exports.hasSpaces = hasSpaces;
module.exports.hash = hash;
module.exports.checkPassword = checkPassword;
