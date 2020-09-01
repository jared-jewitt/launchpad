const CLI = require("clui");
const { Octokit } = require("@octokit/rest");
const { createTokenAuth } = require("@octokit/auth");

let octokit = new Octokit();

module.exports = {
  authenticate: async (token) => {
    const spinner = new CLI.Spinner("Authenticating GitHub...");
    try {
      spinner.start();
      octokit = new Octokit({
        authStrategy: createTokenAuth,
        auth: token,
      });
      return await octokit.request("/user");
    } finally {
      spinner.stop();
    }
  },

  getRepos: async (username) => {
    const spinner = new CLI.Spinner("Fetching repositories...");
    try {
      spinner.start();
      return await octokit.repos.listForUser({
        username,
      });
    } finally {
      spinner.stop();
    }
  },

  createRepoFromScratch: async ({ name, description, private, ...rest }) => {
    const spinner = new CLI.Spinner(`Creating repository: "${name}"`);
    try {
      spinner.start();
      return await octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private,
        ...rest
      });
    } finally {
      spinner.stop();
    }
  },

  createRepoFromTemplate: async ({ name, description, private, template_owner, template_repo, owner, ...rest }) => {
    const spinner = new CLI.Spinner(`Creating repository: "${name}"`);
    try {
      spinner.start();
      return await octokit.repos.createUsingTemplate({
        name,
        description,
        private,
        template_owner,
        template_repo,
        owner,
        ...rest
      });
    } finally {
      spinner.stop();
    }
  },
};
