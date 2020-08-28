const CLI = require("clui");
const { Octokit } = require("@octokit/rest");
const { createNetrcAuth } = require("octokit-auth-netrc");

const octokit = new Octokit({
  authStrategy: createNetrcAuth,
});

module.exports = {
  getUser: async () => {
    const spinner = new CLI.Spinner("Fetching profile...");
    try {
      spinner.start();
      return await octokit.request("/user");
    } finally {
      spinner.stop();
    }
  },

  getRepos: async ({ username, ...rest }) => {
    const spinner = new CLI.Spinner("Fetching repositories...");
    try {
      spinner.start();
      return await octokit.repos.listForUser({
        username,
        ...rest
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
