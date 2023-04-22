const messageCreator = {
  simpleTextMessage(from, text) {
    return {
      messaging_product: "whatsapp",
      to: from,
      text: { body: text },
    };
  },
  locationMessage(from, text){
    return {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
          type: "location_request_message",
          body: {
            type: "text",
            text: text,
          },
          action: {
            "name": "Send Location" 
          },
      }
    }
  },
  replyButtons(from, bodyText, reply1, reply2) {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: bodyText,
          },
          action: {
            buttons: [
              {
                type: "reply",
                "reply": reply1,
              },
              {
                type: "reply",
                "reply": reply2,
              }
            ],
          }
        },
      }
  },
  optionList(from, bodyText) {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        "interactive": {
    "type": "list",
    "header": {
      "type": "text",
      "text": "Found 3 Rides for you"
    },
    "body": {
      "text": "Please choose your ride"
    },
    "action": {
      "button": "Choose",
      "sections": [
        {
          "title": "Drivers and their fares",
          "rows": [
            {
              "id": 1,
              "title": "ABC Rs40",
            },
            {
              "id": 2,
              "title": "XYZ Rs100",
            },
            {
              "id": 3,
              "title": "ABC Rs40",
            },
            {
              "id": 4,
              "title": "XYZ Rs100",
            },
            {
              "id": -1,
              "title": "Cancel"
            }
          ]
        },
      ]
    }
  }
    }
}
}

export default messageCreator;