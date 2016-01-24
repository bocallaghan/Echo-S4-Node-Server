(function () {
    "use strict";
    /*
     * Config.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: HANA Server location details
     */
    
    /*global console, exports*/


    // Replace this with your HANA server details.
    exports.hanaServer = {
        hostname: "awsHANAServer",
        port: 8005,
        username: "AWS_ASK_SERVICE",
        password: "2WxN90o3hyTeXM9"
    };
    
    // Replace this with your amazon skill application ID
    exports.allowedApps = ["amzn1.echo-sdk-ams.app.00000000-0000-0000-0000-000000000000"];
    
}());