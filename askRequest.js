(function () {
    "use strict";
    /*
     * askRequest.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: Generic handler for all requests and determines which handler to use for each request
     */
    
    /*global console, require, exports*/
    
    var launchRequest,
        intentRequest,
        config,
        allowedApps;
    
    launchRequest = require('./RequestHandlers/launchRequest.js');
    intentRequest = require('./RequestHandlers/intentRequest.js');
    config = require('./config.js');
    
    // Import the config of the list of allowed apps to use this service.
    allowedApps = config.allowedApps;

    exports.onRequest = function (req, res) {
        
        var requestType, i, validApp = false;
        
        // First we check that the app being requested is a valid app.
        for (i = 0; i < allowedApps.length; i += 1) {
            if (req.body.session.application.applicationId === allowedApps[i]) {
                validApp = true;
                break;
            }
        }
        
        // If the app is not valid we respond with a 500.
        if (!validApp) {
            
            // Log the invalid app to the console.
            console.log(" " + new Date().toString());
            console.log("\tInvalid application ID provided in request - aborting");
            
            // Respond with a 500 to the requester.
            res.statusCode = 500;
            res.send("Invalid Application");
            
        // Otherwise we proceed with processing the request.
        } else {
        
            // Now we figure out what type of request it is and begin processing.
            requestType = req.body.request.type;
            
            // Figure out which handler to call based on the request type.
            if (requestType === 'LaunchRequest') {
                launchRequest.handleRequest(req, res);
                
            } else if (requestType === 'IntentRequest') {
                intentRequest.handleRequest(req, res);
                
            // Unknown request types trigger a 500.
            } else {
                
                // Log the invalid request type to the console
                console.log(" " + new Date().toString());
                console.log("\tInvalid request type " + requestType + " provided in request - aborting");
                
                // Respond with a 500 to the requester.
                res.statusCode = 500;
                res.send("Unknown request type " + requestType);
            }
        }
    };
}());