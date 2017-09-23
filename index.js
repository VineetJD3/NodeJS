'user strict';

var express = require("express");
var app = express();
var sql = require("mysql");
var events = require("events");
var eventEmitter = new events.EventEmitter();
var crypto = require("crypto");
var bcrypt = require("bcrypt");
var bodyParser = require('body-parser');

var pool = sql.createPool({
    connectionLimit : 3,
    host : "1.255.255.36",
    user : "vfsdev",
    password : "vfsdev",
    database : 'vfsdev',
    port : "3306"
})

app.listen(9099,function(){
    console.log("Listening on 9099")
});

app.get("/test",function(req, res){
    //eventEmitter.emit("getData", req, res);
    
    bcrypt.hash('nexus@123', 10, function(err, hash) {
        console.log(hash);
    });

});

app.post("/validate", function(req, res){
    var body = "";
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
        console.log(body);
        var jsonObj = JSON.parse(body);
        console.log(jsonObj.credentials);
    })
});

eventEmitter.on('getData', function(req, res){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err);
        }else{
            conn.query('select * from state_mst where state_id between 5 and 10', function(error, result, fields){
                if(error){
                    console.log(error);
                }else{
                    //console.log(result);
                    res.send(result);
                    res.end();
                }
            })
        }
    })
})

eventEmitter.on('encrypt', function(req, res){
    

    
})

function encryptData(text){
    var cipher = crypto.createCipher("aes-256-ctr","1");
    var crypted = cipher.update(text,"utf8","hex");
    crypted += cipher.final("hex");
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher("aes-256-ctr","1")
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});