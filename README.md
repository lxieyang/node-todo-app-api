# Node TODO App API

## To run locally

1. Install **MongoDB** on your machine
2. Install **Node.js** on your machine
3. Clone the repo
4. Run `npm install` in the terminal
5. Create data folder for MongoDB by running `mkdir ~/mongo-data`
6. Start mongo server by running `mongod -dbpath ~/mongo-data`
7. Run the app by `npm start` or `node server/server.js`

## Deploying to Heroku

1. Install **Heroku** CLI
2. Use **Git** to track the project
3. Run `heroku create`
4. Run `heroku addons:create mongolab` to add mLab support for MongoDB
5. Set `JWT_SECRET` enviroment variable on Heroku: `heroku config:set JWT_SECRET=jkahsdflku5f3a4df13ds4f3a41dfa53df`
6. Run `git push heroku master`

Follow detailed instructions here: [Deploying with Git](https://devcenter.heroku.com/articles/git)

## Environment variables on Heroku (via Heroku CLI)

- **View** ***all*** the environment variables on heroku in production: `heroku config`
- **Set** new environment variable: `heroku config:set NAME=Michael`
- **Get** individual environment variable: `heroku config:get NAME`
- **Unset** individual environment variable: `heroku config:unset NAME`