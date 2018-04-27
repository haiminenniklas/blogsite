var express = require("express");
var mysql = require("mysql");

var conn = {
    host: "160.153.131.217",
    user: "smath",
    password: "Smath1234!",
    db: "niklas_test"
};

var pool = mysql.createPool({
    connectionLimit: 50,
    host     : conn.host,
    user     : conn.user,
    password : conn.password,
    database : conn.db
});

var execQuery = function(queryStr, callback){

    pool.getConnection(function(err, connection){
        connection.query(queryStr, function(error, results, fields){
           if(!!error){
               connection.release();
               callback(error, results, fields);
           } else {
               connection.release();
               callback(error, results, fields);
           }
        });
    });

};

module.exports.execQuery = execQuery;
module.exports.pool = pool;
module.exports.conn = conn;