const express = require("express");
const mysql = require("mysql");

const conn = {
    host: "160.153.131.217",
    user: "smath",
    password: "Smath1234!",
    db: "niklas_test"
};

let pool = mysql.createPool({
    connectionLimit: 50,
    host     : conn.host,
    user     : conn.user,
    password : conn.password,
    database : conn.db
});

let execQuery = function(queryStr, callback){

    pool.getConnection(function(err, connection){
        //let sql = connection.escape(queryStr);
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