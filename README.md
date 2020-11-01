<p align="center">
  <img alt="Logo" src="https://user-images.githubusercontent.com/22352564/94222217-a33b8c80-fea1-11ea-9aa1-05bbee24ee58.png">
  <p align="center">
    <a href="https://www.npmjs.com/package/the-launch-pad" target="_blank">
      <img alt="Version" src="https://img.shields.io/npm/v/the-launch-pad?color=%23706BF5&style=for-the-badge" />
    </a>
    <a href="https://github.com/jared-jewitt/frontend-booster-react/blob/master/LICENSE" target="_blank">
      <img alt="License" src="https://img.shields.io/npm/l/the-launch-pad?color=%23706BF5&style=for-the-badge" />
    </a>
  </p>
</p>

## How to Install

```shell script
npm i -g the-launch-pad
```

#### Requirements:

- [GitHub Account](https://github.com/)
- [Node](https://nodejs.org/en/download/)

#### Developers:

- [Jared Jewitt](https://jared-jewitt.github.io/)
 

### 🤔 What is the Launchpad?

Launchpad is an interactive CLI wizard used to scaffold a new web application. You install Launchpad globally via npm 
and simply run the `launch` command. This will, in order:

- Ask for a project name
- Ask for a project description
- Ask if the project is private
- Ask which frontend booster you want to use. (React, Vue, Angular, etc)
- Ask which backend booster you want to use. (GraphQL + MongoDB, Flask + PostgreSQL, etc)
- Ask for a GitHub token (used to create repositorie(s) and configure git)
- Create a main GitHub repository based on your project name
- Create additional GitHub repositories for each booster selected
- Clone the main repository to wherever you ran `launch` from
- Add the additional booster repositories as [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to the main repository
- Commit and push the changes made from instantiating the submodules
- The project is now ready to be run and deployed via instructions from an auto-generated README.md file

### 📝 A Note About Boosters

Boosters are just individual boilerplates that are _expected_ to contain run and deployment instructions. Without
boosters, the Launchpad would be useless. Currently, boosters can be found within my
[GitHub repositories](https://github.com/jared-jewitt?tab=repositories). Boosters must respect the following
repository naming convention: `[frontend|backend]-booster-[library/framework]`. For example, a booster name may 
look like `frontend-booster-react-csr`.
 
A full set of Booster guidelines can be found [here](https://github.com/jared-jewitt/booster-guidelines).

### 🚀 Getting Started

1. On your GitHub account, navigate to _Settings / Developer settings / Personal access tokens_.
Generate a new token with the `repo` scope. Copy this token and be ready to use it during the launch
process.

2. Install Launchpad
    ```shell script
    npm i -g the-launch-pad
    ```

3. Blast off!
    ```shell script
    launch
    ```

### ⚖️ License

Code released under the [MIT License](LICENSE).
