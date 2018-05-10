const mysql = require("./mysql.js");
const uuid = require("uuid");
const util = require("./util.js");

//A function that creates and user with given data, and creates an hash for the password, if possible
//Callback returns if the creation had no errors
let createUser = function(username, birthDate, description, firstName, lastName, city, country, plainPassword, callback){

    let joinDate = util.getToday();
    let id = uuid.v1();
    let hashedPassword = util.hash(plainPassword, (success, hash) => {
        if(success){
            let user = new User(username, birthDate, description, firstName, lastName, city, country, hash);
            user.setId(id);
            user.setJoinDate(joinDate);
            user.create((error) => {
                if(!error){
                    callback(false);
                    console.log("User created, with hashed password!");
                } else {
                  callback(error);
                }});
        } else {
            let user = new User(username, birthDate, description, firstName, lastName, city, country, plainPassword);
            user.setId(id);
            user.setJoinDate(joinDate);
            user.create((error) => {
                if(!error){
                    callback(false);
                    console.log("User created, but with plain password!");
                } else {
                    callback(error);
                }
            });
        }
    });

};

let User = function User(username, birthDate, description, firstName, lastName, city, country, password) {

    //Setting variables
    this.username = username;
    this.birthDate = birthDate;
    this.description = description;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = firstName + " " + lastName;
    this.city = city;
    this.country = country;
    this.subscribedTo = [];
    this.blogs = [];
    this.id = null;
    this.joinDate = null;

    //At this point, password should be hashed.
    //Password will be hashed automatically in the createUser() function.
    //If password is not hashed try to hash it again.
    this.password = password;

    //Get the list of ID's of the blogs that the user has subscribed to
    this.getSubscriptions = function(){
        let subscriptions = "";
        for(let i = 0; i < this.subscribedTo.length; i++){
            let subscription = this.subscribedTo[i];

            //Index is not last one
            if(i < this.subscribedTo.length - 1){
                subscriptions.concat(subscription + ",");
            } else {
                subscriptions.concat(subscription);
            }

        }

        return subscriptions;
    };


    this.addSubscription = function(subscription){
        this.subscribedTo.push(subscription);
    };

    this.setSubscriptions = function(subscriptions){
        this.subscribedTo = subscriptions;
    };

    //Get the list of IDs of the user's blogs
    this.getBlogs = function(){
        let blogs = "";
        for(let i = 0; i < this.blogs.length; i++){
            let blog = this.blogs[i];

            //If not the last index
            if(i < this.blogs.length){
                blogs.concat(blog + ",");
            } else {
                blogs.concat(blog);
            }
        }
        return blogs;
    };

    this.addBlog = function(blog){
        this.blogs.push(blog);
    };

    this.setBlogs = function(blogs){
        this.blogs = blogs;
    };

    this.getJoinDate = function(){
        return this.joinDate;
    };

    this.setJoinDate = function(newJoinDate){
      this.joinDate = newJoinDate;
    };

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

    this.save = function(){

        //Saving the data of the user. Password will be hashed when the user itself is created and it will always be hashed
        mysql.execQuery(`UPDATE users SET username = '${this.username}', birthdate = '${this.birthDate}', joindate = '${this.joinDate}', description = '${this.description}',
        first_name = '${this.firstName}', last_name = '${this.lastName}', city = '${this.city}', country = '${this.country}', subscribed_to = '${this.getSubscriptions()}',
        blogs = '${this.getBlogs()}', password = '${this.password}'`,
            (error, results, fields) => {

            });

    };

    //Create the account. Callback returns to possible error
    this.create = function(callback){
        this.canCreate((available) => {
           if(available){
                //Create user, leave subscriptions and blogs to empty (last two), because the user doesn't have blogs when account is created, nor subscriptions
                mysql.execQuery(`INSERT INTO users VALUES('${this.getId()}', '${this.username}','${this.birthDate}', '${this.getJoinDate()}', '${this.description}', '${this.firstName}', '${this.lastName}', '${this.city}', '${this.country}', '[]', '[]', '${this.password}');`,
                    (error, results, fields) => {
                        if(error){
                            callback(error);
                        } else {
                            callback(false);
                        }
                    });
           } else {

               //If doesn't have an id create the id and try to create the user again
               if(!this.hasId()){
                   this.setId(uuid.v1());
                   this.create();
               } else {
                   callback(true);
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
                   available(false);
               } else {
                   if(results.length >= 1){
                       available(false);
                   } else {
                       available(true);
                   }
               }
            });
        }
    };

};

module.exports.User = User;
module.exports.createUser = createUser;