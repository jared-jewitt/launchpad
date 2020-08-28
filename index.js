#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const git = require("simple-git/promise")();
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("./inquirer");
const github = require("./github");
const { formatSentence } = require("./utils/formatters");

(async () => {
  const LAUNCHPAD_OWNER = "jared-jewitt";
  let
    name = "",
    client = "",
    server = "",
    database = "";

  try {
    clear();

    console.log(
      chalk.magenta(
        figlet.textSync("Launchpad", { horizontalLayout: "full" })
      )
    );

    name = await inquirer.askName();

    const validateName = async (n) => {
      if (fs.existsSync(n)) {
        console.log(chalk.yellow(`Your working directory already contains a folder called "${n}". Please try a different name.`));
        name = await inquirer.askName();
        return await validateName(name);
      }
    };
    await validateName(name);

    const description = await inquirer.askDescription();
    const private = await inquirer.askIfPrivate();

    const repos = await github.getRepos({ username: LAUNCHPAD_OWNER });
    const validateStack = async (c, s, d, i) => {
      if (!c && !s && !d) {
        if (i > 0) console.log(chalk.yellow("Please select at least one booster"));
        client = await inquirer.askWhichClient(repos);
        server = await inquirer.askWhichServer(repos);
        database = await inquirer.askWhichDatabase(repos);
        return await validateStack(client, server, database, i + 1);
      }
    };
    await validateStack(client, server, database, 0);

    const confirm = await inquirer.askConfirmation();
    if (!confirm) process.exit();

    const { data: { login: username } } = await github.getUser();
    const stack = [
      ...(!client ? [] : [{
        template_owner: LAUNCHPAD_OWNER,
        template_repo: client,
        owner: username,
        name: `${name}-client`,
        description: "",
        private,
        folderName: "client",
      }]),
      ...(!server ? [] : [{
        template_owner: LAUNCHPAD_OWNER,
        template_repo: server,
        owner: username,
        name: `${name}-server`,
        description: "",
        private,
        folderName: "server",
      }]),
      ...(!database ? [] : [{
        template_owner: LAUNCHPAD_OWNER,
        template_repo: database,
        owner: username,
        name: `${name}-database`,
        description: "",
        private,
        folderName: "database",
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

    await git.clone(`https://github.com/${username}/${name}`, name);
    await git.cwd(path.join(process.cwd(), name));
    process.chdir(name);

    await Promise.all(stack.map(async ({ owner, name, folderName }) => {
      return await git.submoduleAdd(`https://github.com/${owner}/${name}`, folderName);
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
    await git.commit("Add submodules");
    await git.push("origin", "master");

    console.log(
      chalk.magenta(
        figlet.textSync("Blast off!", { horizontalLayout: "full" })
      )
    );
  } catch (e) {
    console.log(chalk.red(e));
  }
})();
