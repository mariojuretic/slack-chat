"use strict";

const expect = require("chai").expect;
const config = require("../../config");
const WitClient = require("../../server/witClient");

describe("witClient", () => {
  describe("ask", () => {
    it("should return a valid wit response", done => {
      const witClient = new WitClient(config.witToken);

      witClient.ask("What is the current time in Vienna?", (err, response) => {
        if (err) return done(err);

        expect(response.intent[0].value).to.equal("time");
        expect(response.location[0].value).to.equal("Vienna");

        return done();
      });
    });
  });
});