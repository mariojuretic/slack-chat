"use strict";

const expect = require("chai").expect;
const config = require("../../config");
const log = config.log("test");
const ServiceRegistry = require("../../server/serviceRegistry");

describe("ServiceRegistry", () => {
  describe("constructor", () => {
    it("should accept a timeout being passed in", () => {
      const serviceRegistry = new ServiceRegistry(42, log);
      expect(serviceRegistry._timeout).to.equal(42);
    });
  });

  describe("add / get", () => {
    it("should add a new intent to the registry and provide it via get", () => {
      const serviceRegistry = new ServiceRegistry(30, log);
      serviceRegistry.add("test", "127.0.0.1", 9999);
      const testIntent = serviceRegistry.get("test");
      expect(testIntent.intent).to.equal("test");
      expect(testIntent.ip).to.equal("127.0.0.1");
      expect(testIntent.port).to.equal(9999);
    });

    it("should update a service", () => {
      const serviceRegistry = new ServiceRegistry(30, log);
      serviceRegistry.add("test", "127.0.0.1", 9999);
      const testIntent1 = serviceRegistry.get("test");
      serviceRegistry.add("test", "127.0.0.1", 9999);
      const testIntent2 = serviceRegistry.get("test");
      expect(Object.keys(serviceRegistry._services).length).to.equal(1);
      expect(testIntent2.timestamp).to.be.at.least(testIntent1.timestamp);
    });
  });

  describe("remove", () => {
    it("should remove a service from the registry", () => {
      const serviceRegistry = new ServiceRegistry(30, log);
      serviceRegistry.add("test", "127.0.0.1", 9999);
      serviceRegistry.remove("test", "127.0.0.1", 9999);
      const testIntent = serviceRegistry.get("test");
      expect(testIntent).to.be.null;
    });
  });

  describe("_cleanup", () => {
    it("should remove expired services", () => {
      const serviceRegistry = new ServiceRegistry(-1, log);
      serviceRegistry.add("test", "127.0.0.1", 9999);
      const testIntent = serviceRegistry.get("test");
      expect(testIntent).to.be.null;
    });
  });
});