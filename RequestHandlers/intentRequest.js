(function () {
    "use strict";
    /*
     * intentRequest.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: Handler for Intent requests
     */
    
    /*global console, require, exports, Buffer*/
    
    var months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    
    function queryHanaForTableSize(returnFunction, year, month) {
        
        var https, config, builtURL, username, password, auth, header, request;
        
        https = require('https');
        config = require('../config.js');

        // Get the HANA username and password and base64 encode them.
        username = config.hanaServer.username;
        password = config.hanaServer.password;
        auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

        // Build the URL with the passed in parameters.
        builtURL = '/sap/opu/odata/sap/FCO_MS_SPEND_SRV/GetSpendingData?FiscalYear=%27' + year + '%27&HierarchyNodeID=%27CEGROB_DEMO%27&ByHierarchyNodeID=%27CCGBFCOO%27&PlanVersion=%27000%27&NumberOfLevels=1&$format=json&SkipTop=false&IsAggregated=true&StartPeriod=%27' + month + '%27&EndPeriod=%27' + month + '%27&sap-client=100';
        
        // Build the header and the request.
        header = {'Host': config.hanaServer.hostname, 'Authorization': auth};
        request = https.request({
            port: config.hanaServer.port,
            host: config.hanaServer.hostname,
            method: 'GET',
            path: builtURL,
            headers: header
        });
        
        // Process the request.
        request.end();
        request.on('response', function (response) {

            if (response.statusCode === 200) {
                
                // The response could be in many chunks so we combine them all
                // to get the full body.
                var body = '';
                response.on('data', function (chunk) {
                    body += chunk;
                });
                
                // once we have all the chunks we process the response.
                response.on('end', function () {
                    var responseObject = JSON.parse(body);
                    returnFunction(responseObject);
                });
            } else {
                returnFunction("Error return code " + response.statusCode);
            }
        });
    }
    
    function responseHandler_budgetCheck(req, res) {
        // Respond to the request with the standard welcome response.
        res.header("Content-Type", "application/json");
        
        var currentResponse = require('./response.js').intentResponseJson,
            year,
            month,
            dateElements;
        
        // Get the date the user passed in or default it to this month if they didnt provide one.
        if (req.body.request.intent.slots.Date.value !== undefined && req.body.request.intent.slots.Date.value !== "") {
            dateElements = req.body.request.intent.slots.Date.value.split("-");
            year = dateElements[0];
            if (dateElements[1] !== undefined) {
                month = dateElements[1];
            } else {
                month = new Date().getMonth();
            }
        } else {
            year = new Date().getFullYear();
            month = new Date().getMonth();
        }

        // Trigger the query to HANA.
        queryHanaForTableSize(function (result) {
            
            var budget, actual, difference, responseText, usagePercentage;
            budget = result.d.results[0].Budget;    // Budget Amount
            actual = result.d.results[0].Actual;    // Actual Amount
            difference = actual - budget;           // Difference between the two
            usagePercentage = (actual / budget) * 100;  // Percentage over/under

            if (difference > 0) {
                responseText = "Your Cost centre is OVER budget for " + months[parseInt(month, 10)] + " " + year + ", as you've used " + parseInt(usagePercentage, 10) + "% of planned expenditure so far. The current total spend is " + parseFloat(actual).toFixed(2) + " " + result.d.results[0].CurrencyKey + " versus  your total budget of " + parseFloat(budget).toFixed(2) + " " + result.d.results[0].CurrencyKey;
            } else if (difference === 0) {
                responseText = "Your Cost centre is matching exactly it's budget of " + budget + " " + result.d.results[0].CurrencyKey;
            } else {
                difference =  difference * -1;
                responseText = "Your Cost centre is under budget for " + months[parseInt(month, 10)] + " " + year + ", as you've used " + parseInt(usagePercentage, 10) + "% of planned expenditure so far. The current total spend is " + parseFloat(actual).toFixed(2) + " " + result.d.results[0].CurrencyKey + " versus  your total budget of " + parseFloat(budget).toFixed(2) + " " + result.d.results[0].CurrencyKey;
            }
            
            // Respond to Amazon using the template in the response.js file, only replacing the text.
            currentResponse.response.outputSpeech.text = responseText;
            currentResponse.response.card.content = currentResponse.response.outputSpeech.text;
            res.send(JSON.stringify(require('./response.js').intentResponseJson));
        }, year, month);
    }
    
    // Initial handling method.
    exports.handleRequest = function (req, res) {
        
        // Log the time so we have context
        console.log(" " + new Date().toString());
        console.log("\tIntent Request received for app: " + req.body.session.application.applicationId);
        console.log("\t\tUser ID: " + req.body.session.user.userId);
        console.log("\t\tIntent: " + req.body.request.intent.name);
        
        if (req.body.request.intent.name === 'GetBudgetStatus') {
            responseHandler_budgetCheck(req, res);
        } else {
            // Error
            res.header("Content-Type", "application/json");
            res.send(JSON.stringify(require('./response.js').errorResponseJson));
        }
    };
    
    
    
    
    
}());