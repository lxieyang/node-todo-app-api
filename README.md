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
5. Run `git push heroku master`

Follow detailed instructions here: [Deploying with Git](https://devcenter.heroku.com/articles/git)