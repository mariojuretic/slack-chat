"use strict";

const request = require("superagent");

module.exports.process = function process(intentData, registry, log, callback) {
  if (intentData.intent[0].value !== "time") {
    return callback(new Error(`Expected time intent, but got ${intentData.intent[0].value}.`));
  }

  if (!intentData.location) {
    return callback(new Error("Missing location in time intent."));
  }

  const location = intentData.location[0].value.replace(/,.?jane/i, "");

  const service = registry.get("time");
  if (!service) return callback(false, "No service available.");

  request.get(`http://${service.ip}:${service.port}/service/${encodeURI(location)}`, (err, res) => {
    if (err || res.statusCode !== 200 || !res.body.result) {
      log.error(err);
      return callback(false, `I had a problem finding out the time in ${location}.`);
    }

    return callback(false, `In ${location} it is now ${res.body.result}.`);
  });
};