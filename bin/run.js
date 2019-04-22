"use strict";

const config = require("../config");

const SlackClient = require("../server/slackClient");
const service = require("../server/service")(config);
const http = require("http");
const server = http.createServer(service);

const WitClient = require("../server/witClient");
const witClient = new WitClient(config.witToken);

const serviceRegistry = service.get("serviceRegistry");
const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, witClient, serviceRegistry);

slackClient.start(() => server.listen(3000));

server.on("listening", function() {
  console.log(`Server is listening on port ${server.address().port} in ${service.get("env")} mode.`);
});