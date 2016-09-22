var HTTPS = require('https');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var botRegex = /^robotcasey$/;

  if(request.sender_id == '25279382') {
    this.res.writeHead(200);
    likeMessage(request.group_id, request.id);
    this.res.end();
  } else if(request.text && request.text.indexOf("robotcasey") != -1) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("ignoring: " + request.sender_id + " | " + request.group_id + " | " + request.id + " | " + request.text);
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = "Sorry, I'm busy liking Quintin's posts.";

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function likeMessage(conversation_id, message_id) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/messages/' + conversation_id + '/' + message_id + '/like',
    method: 'POST'
  };

  console.log('liking convesation: ' + conversation_id + ' message: ' + message_id);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 200) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end();
}


exports.respond = respond;
