# Graphql-ts-server
A GraphQL Server boilerplate made with Typescript, PostgreSQL, and Redis

#### Installation
- Clone project
- git clone https://github.com/despeauxz/Graphql-ts-server.git
- cd into folder
- cd Graphql-ts-server
- Download dependencies by running `yarn`
- Start PostgreSQL server
- Create database called `graphql`
- Add a user with the username postgres and and no password. (You can change what these values are in the ormconfig.json)
- Install and start Redis

#### Usage
You can start the server with yarn start then navigate to http://localhost:4000 to use GraphQL Playground.

#### Features
Register - Send confirmation email
Login
Forgot Password
Logout
Cookies
Authentication middleware
Rate limiting
Locking accounts
Testing (probably Jest)