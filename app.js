/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var request = require('request');
var fetch = require('node-fetch');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

//var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
//var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user


    var name;
    var age;
    var city;
    
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the Dog Predictor Skill, we will try to predict your favorite dog");
        builder.Prompts.text(session, "Hey, what is your name ?");
    },
    function (session, results) {
        name = results.response;
        builder.Prompts.number(session, "We need little more infomration about you to predict your favorite dog. Hang in there and tell me your age");
    },
    function (session, results) {
        age = results.response;
        builder.Prompts.text(session, "And one last question, what is your current city ?");
    },
    function (session, results) {
        city = results.response;
        var msg = "Name: " + name + "<br/> Age: " + age + "<br/> City: " + city ;
       console.log(msg);
       var textmsg = "Hey " + name + " here is your favorite dog";
       // session.send(msg);
        var imgurl;
        
        fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(json => { 
        imgurl = json.message; 
        console.log(imgurl);
        
        
        
        var msg1 = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "And we have predicted, your favorite dog is Beagle",
               body: [
                  {
                    "type": "TextBlock",
                    "text": textmsg,
                    "size": "large"
                },
                {
      "type": "TextBlock",
      "text": "Have Fun!",
      "wrap": "True",
      "size": "medium",
      "weight": "lighter"
    },
    {
      "type": "Image",
      "url": imgurl
        }
        
                ],
        }
    });
        session.send(msg1); 
        
        
        });
       // fetch(`https://dog.ceo/api/breeds/image/random').then(res => res.json()).then(res => console.log(res.message));
         console.log(imgurl);    
         session.endDialog();
    }
     //   console.log("imgage2" + imgurl);
        
       
       
]);
