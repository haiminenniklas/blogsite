const mysql = require("./mysql");
const uuid = require("uuid");
const util = require("./util");

let Post = function Post(id, blog, author, title, message, postdate, editdate, thumbnail){

    this.id = id;
    //Id of the author and the blog, where the post is located
    this.blog = blog;
    this.author = author;

    //Data of the post itself
    this.title = title;
    //This is the text of the post, name is a bit misleading
    this.message = message;
    this.postdate = postdate;
    this.editdate = editdate;
    //The name of the file that is the thumbnail
    this.thumbnail = thumbnail;

    this.hasId = function(){
      return this.id != null;
    };

    this.getId = function(){
        return this.id;
    };

    this.setTitle = function(title){
        if(typeof title !== "string"){
            this.title = title.toString();
        } else {
            this.title = title;
        }
    };

    this.setMessage = function(message){
      if(typeof message !== "string"){
          this.message = message.toString();
      } else {
          this.message = message;
      }
    };

    //Save the post, if any edits were made, callback returns if any error occured
    this.save = function(callback){

        this.editdate = util.getToday();

        mysql.execQuery(`UPDATE posts SET title = '${this.title}', message = '${this.message}', editdate = '${this.editdate}', thumbnail = '${this.thumbnail}'`,
            (error, results, fields) => {
                if(error){
                    callback(error);
                } else {
                    callback(false);
                }
            });

    };

    //Publish the post to the blog, callback returns if an error occured
    this.publish = function(callback){

        //Setting the edit and postdates to the correct dates (dd.mm.YYYY)
        this.postdate = util.getToday();
        this.editdate = util.getToday();

        mysql.execQuery(`INSERT INTO posts VALUES('${this.getId()}', '${this.blog}', '${this.author}', '${this.title}', '${this.author}', '${this.message}', '${this.postdate}',
         '${this.editdate}', '${this.thumbnail}');`,
            (error, results, fields) => {
                if(error){
                    callback(error);
                } else {
                    callback(false);
                }
            });

    };

};

let Blog = function Blog(id, creator){

    this.id = id;
    this.creator = creator;
    this.posts = [];
    this.subscribers = [];

    this.getId = function(){
        if(this.id == null)
            return null;
        else
            return this.id;
    };

    this.hasId = function(){
      return this.getId() != null;
    };

    this.setId = function(newId){
      this.id = newId;
    };

    this.getCreator = function(){
        return this.creator;
    };

    this.save = function(callback){

        mysql.execQuery(`UPDATE blogs SET creator = '${this.getCreator()}', posts = '${this.getPosts()}', subscribers = '${this.getSubscribers()}' WHERE id = '${this.getId()}';`,
            function(error, results, fields){
                if(error){
                    callback(error);
                } else {
                    callback(false);
                }
            });

    };

    //Create this blog and save it to database
    this.create = function(callback){

        //Checking if creation is possible
        this.canCreate((available) => {
           if(available){
               mysql.execQuery(`INSERT INTO blogs VALUES('${this.getId()}', '${this.getCreator()}', '${this.getPosts()}', '${this.getSubscribers()}');`,
                   function(error, results, fields){
                       if(error){
                           callback(error);
                       } else {
                           callback(false);
                       }
                   });
           } else {

               //If blog doesn't have an ID, create the id and try to create it again, else stop
               if(!this.hasId()){
                   this.setId(uuid.v1());
                   this.create((error) => {});
               } else {
                   callback(true);
               }
           }
        });

    };

    //Check if it's possible to create this blog
    this.canCreate = function(available){

        //If it doesn't have an ID, not able to create the blog
        if(!this.hasId()){
            available(false);
        } else {
            mysql.execQuery(`SELECT * FROM blogs WHERE id = '${this.getId()}';`, function(error, results, fields){
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

    this.addSubscriber = function(id){
        this.subscribers.push(id);
    };

    this.addPost = function(id){
        this.posts.push(id);
    };

    this.setPosts = function(newPosts){

        //If given attribute is not an array, make it one
        if(typeof newPosts === "string"){
            this.posts = newPosts.split(",");
        } else  {
            this.posts = newPosts;
        }
    };

    this.setSubscribers = function(newSubs){

        //If given attribute is not an array, make it one
        if(typeof newSubs === "string"){
            this.subscribers = newSubs.split(",");
        } else  {
            this.subscribers = newSubs;
        }
    };

    //Get the list of IDs of the blog's subscribers
    this.getSubscribers = function(){

        let subscribers = "";
        for(let i = 0; i < this.subscribers.length; i++){
            let subscriber = this.subscribers[i];

            //If not the last index
            if(i < this.subscribers.length){
               subscribers.concat(subscriber + ",");
            } else {
                subscribers.concat(subscriber);
            }

        }
        return subscribers;
    };

    //Get the list of IDs of the blog's posts
    this.getPosts = function(){

        let posts = "";
        for(let i = 0; i < this.posts.length; i++){
            let post = this.posts[i];

            //If not the last index
            if(i < this.posts.length){
                posts.concat(post + ",");
            } else {
                posts.concat(post);
            }

        }
        return posts;

    };

};

module.exports.Blog = Blog;
module.exports.Post = Post;