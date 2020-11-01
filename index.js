#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const git = require("simple-git/promise")();
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");

const inquirer = require("./inquirer");
const github = require("./github");
const constants = require("./constants");
const { formatSentence } = require("./utils/format");

(async () => {
  try {
    clear();

    console.log(
      chalk.cyan(
        figlet.textSync("Launchpad", { horizontalLayout: "full" })
      )
    );

    const { name, description, private } = await inquirer.askMeta();
    const { frontend, backend } = await inquirer.askStack();
    const { token, username } = await inquirer.askToken();

    const stack = [
      ...(!frontend ? [] : [{
        template_owner: constants.LAUNCHPAD_OWNER,
        template_repo: frontend,
        owner: username,
        name: `${name}-frontend`,
        description: "",
        private,
        folderName: "frontend",
      }]),
      ...(!backend ? [] : [{
        template_owner: constants.LAUNCHPAD_OWNER,
        template_repo: backend,
        owner: username,
        name: `${name}-backend`,
        description: "",
        private,
        folderName: "backend",
      }]),
    ];

    await github.createRepoFromScratch({
      name,
      description,
      private,
      license_template: "mit",
    });

    await Promise.all(stack.map(async ({ template_owner, template_repo, owner, name, description, private }) => {
      return await github.createRepoFromTemplate({
        name,
        description,
        private,
        template_owner,
        template_repo,
        owner,
      });
    }));

    await git.clone(`https://${username}:${token}@github.com/${username}/${name}.git`, name);
    await git.cwd(path.join(process.cwd(), name));
    process.chdir(name);

    await Promise.all(stack.map(async ({ owner, name, folderName }) => {
      return await git.submoduleAdd(`https://${username}:${token}@github.com/${owner}/${name}.git`, folderName);
    }));

    const stream = fs.createWriteStream("README.md");
    stream.once("open", () => {
      stream.write(`# ${formatSentence(name)}\n`);
      stream.write(`\n${description}\n`);
      stack.forEach((s) => {
        stream.write(`\n### Running / Deploying the ${s.folderName}\n`);
        stream.write(`\n[Instructions here](${s.folderName}/README.md)\n`);
      });
      stream.end();
    });

    await git.add(".");
    await git.commit("Blast off 🚀");
    await git.push("origin", "master");

    console.log(
      chalk.cyan(
        figlet.textSync("Blast off!", { horizontalLayout: "full" })
      )
    );
  } catch (e) {
    console.log(chalk.red(e));
  }
})();
