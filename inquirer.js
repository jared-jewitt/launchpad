const inquirer = require("inquirer");
const { formatPath, formatRepos } = require("./utils/formatters");

module.exports = {
  askName: async () => {
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
    ];

    const { name } = await inquirer.prompt(questions);
    return formatPath(name);
  },

  askDescription: async () => {
    const questions = [
      {
        name: "description",
        type: "input",
        message: "Enter a description for your project:",
        validate: (value) => {
          if (value.length) return true;
          return "Please enter a description for your project.";
        },
      },
    ];

    const { description } = await inquirer.prompt(questions);
    return description;
  },

  askIfPrivate: async () => {
    const questions = [
      {
        name: "isPrivate",
        type: "confirm",
        message: "Is this going to be a private repository?",
      },
    ];

    const { isPrivate } = await inquirer.prompt(questions);
    return isPrivate;
  },

  askWhichClient: async (repos) => {
    const boosters = formatRepos("client-booster-", repos);
    const questions = [
      {
        name: "client",
        type: "list",
        message: "Select a client:",
        choices: boosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a client.";
        },
      },
    ];

    const { client } = await inquirer.prompt(questions);
    return boosters.find(b => b.label === client).value;
  },

  askWhichServer: async (repos) => {
    const boosters = formatRepos("server-booster-", repos);
    const questions = [
      {
        name: "server",
        type: "list",
        message: "Select a server:",
        choices: boosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a server.";
        },
      },
    ];

    const { server } = await inquirer.prompt(questions);
    return boosters.find(b => b.label === server).value;
  },

  askWhichDatabase: async (repos) => {
    const boosters = formatRepos("database-booster-", repos);
    const questions = [
      {
        name: "database",
        type: "list",
        message: "Select a database:",
        choices: boosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a database.";
        },
      },
    ];

    const { database } = await inquirer.prompt(questions);
    return boosters.find(b => b.label === database).value;
  },

  askConfirmation: async () => {
    const questions = [
      {
        name: "confirm",
        type: "confirm",
        message: "Are you sure you would like to use this stack?",
      },
    ];

    const { confirm } = await inquirer.prompt(questions);
    return confirm;
  },
};
