"use strict";

const { RTMClient } = require("@slack/rtm-api");
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(connectData) {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}, but not connected to a channel.`);
}

function handleOnMessage(message) {
  if (message.text.toLowerCase().includes("jane")) {
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent.");
        }

        const intent = require("./intents/" + res.intent[0].value + "Intent");

        intent.process(res, registry, function(error, response) {
          if (error) {
            console.log(error.message);
            return;
          }

          return rtm.sendMessage(response, message.channel);
        });
      } catch (err) {
        console.log(err);
        console.log(res);
        rtm.sendMessage("Sorry, I don't know what you're talking about.", message.channel);
      }
    });
  }
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on("authenticated", handler);
}

module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
  rtm = new RTMClient(token, { logLevel: logLevel });
  nlp = nlpClient;
  registry = serviceRegistry;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on("message", handleOnMessage);
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;