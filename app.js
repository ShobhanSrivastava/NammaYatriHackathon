/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

import message from './utility/messageCreator'
// import SessionToken from './models/sessionToken'
// import data from './data';

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;
const DB_CONN = process.env.DB_CONN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json());// creates express http server

// import mongoose from 'mongoose';
// console.log(DB_CONN);
// mongoose.connect(DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', ()=>{
//     console.log('DB connection successful');
// })

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      // let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      
      const stage = 8;
      if(stage == 1) {
        axios(getAxiosData(
        phone_number_id,
        message.replyButtons(from, "Welcome to Namma Yatri", {id: 1, title: "Let's Begin"}, {id: 2, title: "Cancel"}),
      ));
      }
      else if(stage == 2) {
        let reply = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
        
        if(reply == 1) 
        axios(getAxiosData(
        phone_number_id,
        message.simpleTextMessage(from, "Please send your pickup location")));
      }
      else if(stage == 3) {
        axios(getAxiosData(
        phone_number_id,
        message.replyButtons(from, "Confirm Pickup location", {id: 1, title: "Confirm"}, {id: 2, title: "Edit"}),
      ));
      }
      else if(stage == 4) {
        let reply = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
        
        if(reply == 1) 
        axios(getAxiosData(
        phone_number_id,
        message.simpleTextMessage(from, "Please send your drop location")));
      }
      else if(stage == 5) {
        axios(getAxiosData(
        phone_number_id,
        message.replyButtons(from, "Confirm Drop location", {id: 1, title: "Confirm"}, {id: 2, title: "Edit"}),
      ));
      }
      else if(stage == 6) {
        let reply = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
        
        if(reply == 1) 
        axios(getAxiosData(
        phone_number_id,
        message.replyButtons(from, "Find Rides", {id: 1, title: "Confirm"}, {id: 2, title: "Cancel"}),));
      }
      else if(stage == 7) {
        let reply = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
        
        if(reply == 1) 
        axios(getAxiosData(
        phone_number_id,
        message.simpleTextMessage(from, "Finding clean and safe rides for you!")));
        
        setTimeout(() => axios(getAxiosData(
        phone_number_id,
        message.optionList(from, "body"))), 3000);
      }
      else if(stage == 8){
        axios(getAxiosData(
        phone_number_id,
        message.simpleTextMessage(from, "XYZ is on his way to pick you up!\nYou can contact him at 9999999999")));
      }
      
      
      function getAxiosData(phone_number_id, data) {
        return {
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v12.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            // data: message.simpleTextMessage(from, "Sample\nText"),
            data: data,
            headers: { "Content-Type": "application/json" },
        }
      }
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
