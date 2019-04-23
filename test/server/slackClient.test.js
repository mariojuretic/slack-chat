"use strict";

const expect = require("chai").expect;
const config = require("../../config");
const log = config.log("test");
const SlackClient = require("../../server/slackClient");

describe("slackClient", () => {
  it("should connect to slack", done => {
    const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, null, null, log);

    slackClient.start(slackRes => {
      expect(slackRes.ok).to.be.true;
      return done();
    });
  });
});