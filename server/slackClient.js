"use strict";

const { RTMClient } = require("@slack/rtm-api");

class SlackClient {
  constructor(token, logLevel, nlp, registry, log) {
    this._rtm = new RTMClient(token, { logLevel });
    this._nlp = nlp;
    this._registry = registry;
    this._log = log;

    this._addAuthenticatedHandler(this._handleOnAuthenticated);
    this._rtm.on("message", this._handleOnMessage.bind(this));
  }

  _handleOnAuthenticated(connectData) {
    this._log.info(`Logged in as ${connectData.self.name} of team ${connectData.team.name}.`);
  }

  _addAuthenticatedHandler(handler) {
    this._rtm.on("authenticated", handler.bind(this));
  }

  _handleOnMessage(message) {
    if (message.text.toLowerCase().includes("jane")) {
      this._nlp.ask(message.text, (err, res) => {
        if (err) {
          this._log.error(err);
          return;
        }

        try {
          if (!res.intent || !res.intent[0] || !res.intent[0].value) {
            throw new Error("Could not extract intent.");
          }

          const intent = require("./intents/" + res.intent[0].value + "Intent");

          intent.process(res, this._registry, this._log, (error, response) => {
            if (error) {
              this._log.error(error.message);
              return;
            }

            return this._rtm.sendMessage(response, message.channel);
          });
        } catch(err) {
          this._log.error(err);
          this._log.error(res);
          this._rtm.sendMessage("Sorry, I don't know what you're talking about.", message.channel);
        }
      });
    }
  }

  start(handler) {
    this._addAuthenticatedHandler(handler);
    this._rtm.start();
  }
}

module.exports = SlackClient;