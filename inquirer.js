const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const github = require("./github");
const { config } =  require("./utils/config");
const { LAUNCHPAD_OWNER } = require("./utils/constants");
const { formatPath, formatRepos } = require("./utils/format");

module.exports = {
  askMeta: async () => {
    const questions = [
      {
        name: "name",
        type: "input",
        message: "Enter a name for your project:",
        validate: (value) => {
          if (value.length) return true;
          return "Please enter a name for your project.";
        },
      },
      {
        name: "description",
        type: "input",
        message: "Enter a description for your project:",
        validate: (value) => {
          if (value.length) return true;
          return "Please enter a description for your project.";
        },
      },
      {
        name: "isPrivate",
        type: "confirm",
        message: "Is this going to be a private repository?",
      },
    ];

    let { name, description, isPrivate } = await inquirer.prompt(questions);

    const verifyName = async (n) => {
      if (fs.existsSync(n)) {
        console.log(chalk.yellow(`Your working directory already contains a folder called "${n}". Please try a different name.`));
        ({ name } = await inquirer.prompt(questions[0]));
        return await verifyName(name);
      }
    };
    await verifyName(name);

    return { name: formatPath(name), description, private: isPrivate };
  },

  askStack: async () => {
    const repos = await github.getRepos(LAUNCHPAD_OWNER);
    const clientBoosters = formatRepos("client-booster-", repos);
    const serverBoosters = formatRepos("server-booster-", repos);
    const databaseBoosters = formatRepos("database-booster-", repos);

    const questions = [
      {
        name: "client",
        type: "list",
        message: "Select a client:",
        choices: clientBoosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a client.";
        },
      },
      {
        name: "server",
        type: "list",
        message: "Select a server:",
        choices: serverBoosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a server.";
        },
      },
      {
        name: "database",
        type: "list",
        message: "Select a database:",
        choices: databaseBoosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a database.";
        },
      },
      {
        name: "confirm",
        type: "confirm",
        message: "Are you sure you would like to use this stack?",
      },
    ];

    let { client, server, database, confirm } = await inquirer.prompt(questions);

    const verifyStack = async (c) => {
      if (!c) {
        ({ client, server, database, confirm } = await inquirer.prompt(questions));
        return await verifyStack(confirm);
      }
    };
    await verifyStack(confirm);

    return {
      client: clientBoosters.find(b => b.label === client).value,
      server: serverBoosters.find(b => b.label === server).value,
      database: databaseBoosters.find(b => b.label === database).value,
    };
  },

  askToken: async () => {
    const questions = [
      {
        name: "token",
        type: "input",
        message: "Enter your GitHub personal access token (https://github.com/settings/tokens)",
        validate: (value) => {
          if (value.length) return true;
          return "Please enter your GitHub personal access token.";
        },
      },
    ];

    let data = {};
    let token = config.get("token");
    if (!token) ({ token } = await inquirer.prompt(questions));

    const verifyToken = async (t) => {
      try {
        ({ data } = await github.authenticate(t));
        config.set("token", t);
      } catch (e) {
        config.set("token", null);
        console.log(chalk.yellow("Invalid token. Please enter a valid GitHub personal access token"));
        ({ token } = await inquirer.prompt(questions));
        return await verifyToken(token);
      }
    };
    await verifyToken(token);

    return { token, username: data.login };
  },
};
