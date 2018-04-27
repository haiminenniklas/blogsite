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
        this.id = newId;
    };

    this.hasId = function(){
        return this.getId() != null;
    };

    this.create = function(){
        this.canCreate((available) => {
           if(available){
                //Create user
                mysql.execQuery(`INSERT INTO users VALUES();`)
           } else {
               //If doesn't have an id create the id and try to create the user again
               if(!this.hasId()){
                   this.setId(uuid.v1());
                   this.create();
               }
           }
        });
    };

    this.canCreate = function(available){
        //If user doesn't have an ID, don't create it
        if(!this.hasId()){
            available(false);
        } else {
            let id = this.getId();
            //If some other user is found with the same id, don't create this user
            mysql.execQuery(`SELECT * FROM users WHERE id = '${id}';`, (error, results, fields) => {
               if(error){
                   available(true);
               } else {
                   available(false);
               }
            });
        }
    };

};

module.exports.User = User;