var express = require('express');
var mongoskin = require('mongoskin');

var app = express();
var db = mongoskin.db('localhost:27017/hatim_test', {safe:true});

/*
    Basic Http Authentication object
*/
var auth = express.basicAuth(function(user, pass, callback) {
    if(typeof user == "undefined" || user == null || user == ""){
        return false;
    }
    var users = db.collection("users");
    var error = null;
    var result = false;
    var cursor = users.find({_id: user}).toArray(function(err, userDocs){
        if(err){
            error = err;
        }else{
            for (var i = userDocs.length - 1; i >= 0; i--) {
                if(pass == userDocs[i].pwd){
                    result = true;
                }
            }
        }
        callback(error, result);
    });
});

/*
    Root page
*/
app.get('/', function(req, res, next) {
    res.send("Free zone! Enyoy :)");
});

/*
    Get page with page number
*/
app.get('/page/:pageNo', auth, function(req, res, next) {
    res.send("Page " + req.params.pageNo + " is requested.");
});

/*
    Get user with user name
*/
app.get('/user/:userName', auth, function(req, res, next) {
    var query;
    if(req.params.userName != "all"){
        query = {_id: req.params.userName};
    }
    var cursor = db.collection("users").find(query).toArray(function(err, users){
        if(err){
            res.send("ERROR: " + err);
        }else{
            if(users.length > 1){
                // there shouldn't be more than one
                var response = "ERROR: Multiple users found with the same username: " + req.params.userName;
            }else{
                var response = JSON.stringify({username: users[0]._id, page: users[0].page}, null, 4);
            }
            res.send(response);
        }
    });
});

/*
    Add user with user name and password
*/
app.post('/adduser/:username/:password', auth, function(req, res, next){
    var users = db.collection("users");
    var user = { _id: req.params.username, pwd: req.params.password };
    users.insert(user, {w:1}, function(err, doc){
        if(err){
            res.send("ERROR: " + err);
        }else{
            res.send("User " + doc.name + " is added!");
        }
    });
});

app.listen(1111);