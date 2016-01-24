(function () {
    "use strict";
    /*
     * index.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: Main file of the HANA App Amazon voice web services
     */
    
    /*global console, require*/
    
    var express,
        app,
        os,
        ask,
        bodyParser,
        version = 1.0,
        port = 3000;
    
    express = require('express');
    bodyParser = require('body-parser');
    app = express();
    os = require("os");
    ask = require("./askRequest.js");
    
    app.use(bodyParser.json());  // Use the body parser for json.
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/', function (req, res) {
        ask.onRequest(req, res);
    });

    app.listen(port, function () {
        console.log('HANApp Launched at ' + new Date().toString());
        console.log('Server Details:');
        console.log('\tVersion: ' + version);
        console.log('\tPort: ' + port);
        console.log('\tHost: ' + os.hostname());
        console.log('=========================================================');
    });
    
}());