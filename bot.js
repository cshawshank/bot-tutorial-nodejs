var HTTPS = require('https');
var botID = process.env.BOT_ID;
var my_token = process.env.TOKEN;
var friend_id = process.env.FRIEND_ID;
var google_api_key = process.env.GOOGLE_API_KEY;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  
  console.log("attachments: " +  JSON.stringify(request.attachments));

  if(request.sender_id != friend_id) {
    if(request.text && (request.text.indexOf("@robotcasey") != -1 || request.text.indexOf("@caseyrobot") != -1)) {
      this.res.writeHead(200);
      postMessage("Sorry, I was only built to like (what i deem) postitive sentiment posts and all pictures.");
      this.res.end();
    } else {
      this.res.writeHead(200);
      likeMessage(request.group_id, request.id);
      this.res.end();
    }
  } else {
    console.log("ignoring this request");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var options, body, botReq;

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
    path: '/v3/messages/' + conversation_id + '/' + message_id + '/like?token=' + my_token,
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
