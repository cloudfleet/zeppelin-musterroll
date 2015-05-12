var user_store_json = require('musterroll-userstore-json');
var musterroll_ldap = require('musterroll-ldap');
var musterroll_api = require('musterroll-api');
var http = require('http');
var request = require('request');
var argv = require('minimist')(process.argv.slice(2));
var ejs  = require('ejs');
var fs = require('fs');

var userStoragePath = argv["user-storage-path"] || "/opt/cloudfleet/data";

var userStore = user_store_json.createUserStore({config_file_location: userStoragePath});

var domain = argv["domain"] || "example.com";

var testing_mode = argv["testing"] == "true";

var skip_message_bus = testing_mode;

if(testing_mode){
  console.log("Starting in TESTING mode");
}
console.log("Starting LDAP server with base domain " + domain);

var ldapServer = musterroll_ldap.createServer(
    {
        userStore: userStore,
        rootDN: domain.split(".").map(function(part){return "dc=" + part;}).join(", ")
    }
);


try{
    ldapServer.listen(389, function() {
        console.log('LDAP server listening at ' + ldapServer.url);
    });
}
catch(error)
{
    console.log(error);
}

var webServer = musterroll_api.createServer({
    userStore: userStore,
    user_store_initializer: function(username, password, userStore, callback, error_callback){

        var user = {
            "id":username,
            "isAdmin":true
        };
        userStore.updateUser(user);
        userStore.setPassword(user["id"], password);
        callback(user);
        };
    }
});

webServer.use("/", express.static(__dirname + '/public'));

webServer.listen(80, function(){
    "use strict";
    console.log('API server listening on port 80');
});
