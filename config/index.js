require("dotenv").config();
const bunyan = require("bunyan");

const log = {
  development: () => {
    return bunyan.createLogger({ name: "development", level: "debug" });
  },
  production: () => {
    return bunyan.createLogger({ name: "production", level: "info" });
  },
  test: () => {
    return bunyan.createLogger({ name: "test", level: "fatal" });
  }
};

module.exports = {
  witToken: process.env.WIT_TOKEN,
  slackToken: process.env.SLACK_TOKEN,
  slackLogLevel: "verbose",
  serviceTimeout: 30,
  appApiToken: process.env.APP_API_TOKEN,
  log: env => {
    if (env) return log[env]();
    return log[process.env.NODE_ENV || "development"]();
  }
};