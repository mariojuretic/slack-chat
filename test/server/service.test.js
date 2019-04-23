"use strict";

const chai = require("chai");
chai.use(require("chai-string"));
const expect = chai.expect;
const request = require("supertest");
const config = require("../../config");
const service = require("../../server/service")(config);

describe("the express service", () => {
  describe("PUT /foo", () => {
    it("should return HTTP 404", done => {
      request(service)
        .put("/foo")
        .expect(404, done);
    });
  });

  describe("PUT /service/:intent/:port", () => {
    it("should return HTTP 200 with valid result", done => {
      request(service)
        .put("/service/test/9999")
        .set("X-APP-API-TOKEN", config.appApiToken)
        .set("X-APP-SERVICE-TOKEN", "something")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.result).to.startWith("test at");
          return done();
        });
    });

    it("should return HTTP 403 if no API token provided", done => {
      request(service)
        .put("/service/test/9999")
        .expect(403)
        .end(done);
    });

    it("should return HTTP 400 if no service token provided", done => {
      request(service)
        .put("/service/test/9999")
        .set("X-APP-API-TOKEN", config.appApiToken)
        .expect(400)
        .end(done);
    });
  });
});