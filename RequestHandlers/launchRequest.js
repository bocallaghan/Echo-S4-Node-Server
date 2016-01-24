(function () {
    "use strict";
    /*
     * launchRequest.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: Handler for Launch requests
     */
    
    /*global console, require, exports*/

    exports.handleRequest = function (req, res) {
        
        // Log the time so we have context
        console.log(" " + new Date().toString());
        console.log("\tNew registration for app: " + req.body.session.application.applicationId);
        console.log("\t\tUser ID: " + req.body.session.user.userId);
        
        // Respond to the request with the standard welcome response.
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(require('./response.js').welcomeResponseJson));
    };
}());