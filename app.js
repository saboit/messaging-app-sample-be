const express = require('express');
const app = express();

const bodyParser = require('body-parser'); // parser for post requests
const AssistantV2 = require('ibm-watson/assistant/v2'); // watson sdk
const { IamAuthenticator } = require('ibm-watson/auth');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const credentials = {
  API_KEY: '9dLH10NOMpracXoD7RrGD_tqGfj0NxUHhPeDA6F72nTC',
  URL:  'https://api.eu-gb.assistant.watson.cloud.ibm.com',
  VERSION: '2019-02-28',
  ASSISTANT_ID: '0dcecb0a-1aa3-444f-8201-caccdf94f3c6'
}


const authenticator = new IamAuthenticator({
  apikey: credentials.API_KEY
})

var assistant = new AssistantV2({
  authenticator: authenticator,
  url: credentials.URL,
  version: credentials.VERSION,
  disableSslVerification: true
});



app.post('/message', function (req, res) {
  if (!req.body.sessionId || !req.body.message) {
    res.status(400).send("bad request")
  }
  var payload = {
    assistantId: credentials.ASSISTANT_ID,
    sessionId: req.body.sessionId,
    input: {
      message_type : 'text',
      text : req.body.message
    }
  };      
  assistant.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err)
    }
    return res.json(data)
  })
})




app.get('/session_id', function (req, res) {
  assistant.createSession(
    {
      assistantId: credentials.ASSISTANT_ID,
    },
      function(error, response) {
        if (error) {
          return res.send(error);
        } else {
          return res.send(response);
        }
      }
    );
  })
  
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
