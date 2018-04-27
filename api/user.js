const mysql = require("./mysql.js");
const uuid = require("uuid");

let User = function User(username, description, firstName, lastName, city, country) {

    this.username = username;
    this.description = description;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = firstName + " " + lastName;
    this.city = city;
    this.country = country;
    this.subscribedTo = [];
    this.blogs = [];
    this.id = null;

    this.getId = function(){
        if(this.id == null)
            return null;
        else
            return this.id;
    };

    this.setId = function(newId){

    };

    this.create = function(){

    };

    this.checkAvailability = function(callback){

    };

};

module.exports.User = User;