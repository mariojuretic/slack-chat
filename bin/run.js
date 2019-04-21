"use strict";

const slackClient = require("../server/slackClient");
const service = require("../server/service");
const http = require("http");
const server = http.createServer(service);

const witToken = "QCI5FGAOUA4QFSIBWW3VQLHPSGPTP44E";
const witClient = require("../server/witClient")(witToken);

const slackToken = "xoxb-609437733972-609976269493-uUMb4tNbgFPOTaAHcpBE06fN";
const slackLogLevel = "verbose";

const serviceRegistry = service.get("serviceRegistry");
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on("listening", function() {
  console.log(`Server is listening on port ${server.address().port} in ${service.get("env")} mode.`);
});