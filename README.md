# Launchpad

> 🚀 The fastest way to bootstrap an app

#### Requirements:

- [GitHub Account](https://github.com/)
- [Node](https://nodejs.org/en/download/)

#### Developers:

- [Jared Jewitt](https://jared-jewitt.github.io/)
 
#### High Level Description

The Launchpad is an interactive CLI wizard used to scaffold a new web application tailored to your specific stack needs.

#### Low Level Description

You install The Launchpad globally via npm and simply run the `launch` command. This will, in order:
- Ask for a project name
- Ask for a project description
- Ask if the project is private
- Ask which client "booster" you want to use. (React, Vue, Angular, etc)
- Ask which server "booster" you want to use. (Nest, GraphQL, Flask, etc)
- Ask which database "booster" you want to use. (PostgreSQL, MongoDB, SQLLite, etc)
- Create a main GitHub repository based on your project name
- Create additional GitHub repositories for each booster selected
- Clone the main repository to wherever you ran `launch` from
- Add the additional booster repositories as [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to the main repository
- Commit and push the changes made from instantiating the submodules
- The project is now ready to be run and deployed via instructions from an auto-generated README.md file

#### What's a "Booster"?

Boosters are just individual boilerplates that are _expected_ to contain run and deployment instructions. Without
boosters, The Launchpad would be useless. Currently, boosters can be found within
[my GitHub repositories](https://github.com/jared-jewitt?tab=repositories). Boosters must respect the following
repository naming convention: `[client|server|database]-booster-[library/framework]`. For example, a booster may 
look like `client-booster-react`.
 
A full set of Booster guidelines can be found [here](https://github.com/jared-jewitt/booster-guidelines).

## Getting Started

1. On your GitHub account, navigate to Settings / Developer settings / Personal access tokens.
Generate a new token with the `repo` scope.

2. Add a `.netrc` file to your `$HOME` directory. Below is a template of what your file should look like. Replace
the placeholders with your information:
    ```
    machine github.com
      login <username>
      password <token>
    
    machine api.github.com
      login <token>
    ```

3. Install The Launchpad
    ```shell script
    npm i -g the-launch-pad
    ```

4. Blast off!
    ```shell script
    launch
    ```

## License

Code released under the [MIT License](LICENSE).
