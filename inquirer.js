const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const github = require("./github");
const constants = require("./constants");
const { config } =  require("./utils/config");
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
    const repos = await github.getRepos(constants.LAUNCHPAD_OWNER);
    const frontendBoosters = formatRepos("frontend-booster-", repos);
    const backendBoosters = formatRepos("backend-booster-", repos);

    const questions = [
      {
        name: "frontend",
        type: "list",
        message: "Select a frontend:",
        choices: frontendBoosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a frontend.";
        },
      },
      {
        name: "backend",
        type: "list",
        message: "Select a backend:",
        choices: backendBoosters.map(b => b.label),
        validate: (value) => {
          if (value.length) return true;
          return "Please select a backend.";
        },
      },
      {
        name: "confirm",
        type: "confirm",
        message: "Are you sure you would like to use this stack?",
      },
    ];

    let { frontend, backend, confirm } = await inquirer.prompt(questions);

    const verifyStack = async (c) => {
      if (!c) {
        ({ frontend, backend, confirm } = await inquirer.prompt(questions));
        return await verifyStack(confirm);
      }
    };
    await verifyStack(confirm);

    return {
      frontend: frontendBoosters.find(b => b.label === frontend).value,
      backend: backendBoosters.find(b => b.label === backend).value,
    };
  },

  askToken: async () => {
    const questions = [
      {
        name: "token",
        type: "input",
        message: "Enter your GitHub personal access token (Obtain here: https://github.com/settings/tokens):",
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
