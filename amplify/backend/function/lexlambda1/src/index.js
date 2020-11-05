

//exports.handler = async (event) => {
    // TODO implement
    //const response = {
        //statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*"
    //  }, 
        //body: JSON.stringify('Hello from Lambda!'),
    //};
    //return response;
//};
console.log('Loading event');
import { v4 as uuidv4 } from 'uuid';
//const { v1: uuidv1 } = require('uuid');
//const { v4: uuidv4 } = require('uuid');
//const uuidv1 = require('uuid');
//console.log(uuidv1.v1())
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var tableName = "booking-dev";

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function storeBooking(intent, callback) {

    let bookInfo = {};

    // store every slot we received as part of registration
   // Object.keys(intent.currentIntent.slots).forEach((item) => {
       // console.log(item)
       // bookInfo[item] = {"S": intent.currentIntent.slots[item]};
   // });

    // store a registration date
   // userInfo.registration_date = {"S": new Date().getTime().toString() };
    //userInfo.registration_userid = {"S": intent.userId};
   const slots = intent.currentIntent.slots;
    
    var params = {
        TableName: tableName,
        Item: {
               reservation_id : {
                   S: uuidv4()
               },
                customer_id : {
                    S: uuidv4()
                },
                hotel_id : {
                    S: slots.hotel_id
                    },
                checkin : {
                    S: slots.checkin
                },
                checkout : {
                    S: slots.checkout
                    },
                room_id : {
                    S: uuidv4()
                    },
        }
    };

// Call DynamoDB to add the item to the table
    dynamodb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        callback(close(intent.sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': "I am sorry, but something went wrong in booking Info. Please try again."}));
      } else {
        console.log("Success", data);
        callback(close(intent.sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': "Thank you for booking."}));
      }
    });
    
    // dynamodb.putItem({
    //     "TableName": tableName,
    //     "Item" : {
    //         'reservation_id' :"342",
    //         'customer_id' : "111",
    //         'hotel_id' : slots.hotel_id,
    //         'checkin' : slots.checkin,
    //         'checkout' : slots.checkout,
    //         'room_id' : "456",
    //     }
    // }, 
    // function(err, data) {
    //     if (err) {
    //         console.log('Failure storing user info');
    //         console.log(err);
    //         callback(close(intent.sessionAttributes, 'Fulfilled',
    //         {'contentType': 'PlainText', 'content': "I am sorry, but something went wrong in booking Info. Please try again."}));
    //     } else {
    //         console.log("Successfully Stored UserInfo");
    //         callback(close(intent.sessionAttributes, 'Fulfilled',
    //         {'contentType': 'PlainText', 'content': "Thank you for booking."}));
    //     }
    // });
}

// --------------- Main handler -----------------------
 
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    console.log(event);
    try {
        storeBooking(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};