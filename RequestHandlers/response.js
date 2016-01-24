(function () {
    "use strict";
    /*
     * response.js
     * @Author: Brenton O'Callaghan
     * @Date: 20th Feb 2016
     * @Description: Provides the structure for a response output.
     */
    
    /*global console, exports*/


    exports.welcomeResponseJson = {
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": "Hey there! Welcome to HANApp - your voice activated HANA assistant."
            },
            "card": {
                "type": "Simple",
                "title": "HANApp",
                "content": "Hey there! Welcome to HANApp - your voice activated HANA assistant."
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "Can I help you with anything else?"
                }
            },
            "shouldEndSession": true
        }
    };
    
    exports.intentResponseJson = {
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": ""
            },
            "card": {
                "type": "Simple",
                "title": "HANA-App",
                "content": ""
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "Can I help you with anything else?"
                }
            },
            "shouldEndSession": true
        }
    };
    
    exports.errorResponseJson = {
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": "Unfortunately we've had an error retrieving a response from HANA - please try again later"
            },
            "card": {
                "type": "Simple",
                "title": "HANApp",
                "content": "Unfortunately we've had an error retrieving a response from HANA - please try again later"
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "Can I help you with anything else?"
                }
            },
            "shouldEndSession": true
        }
    };
    
}());