# Northcoders News API

## Project Summary

NC News is an online bulletin-style news site where users can post articles and comments on them, much in the vein of Reddit. Currently constructed is a back-end database and API. Other accessible information include topics and users.

Coming Soon: A fully functional front-end.

## Hosted Demo

You can find a hosted demo of the API at [https://nc-news-6ukh.onrender.com/api](https://nc-news-6ukh.onrender.com/api). This homepage should have a detailed description of all the currently implemented endpoints and what data you can expect from them when invoked.

## Running your own instance of this repo

### Cloning the repo
This repo is public and can be forked and cloned from its [Github homepage](https://github.com/VenturingForth/nc-news). Once you have cloned this repo, you will need to install a few Node dependences and setup the environment variables before seeding the data.

### Required Node Dependencies
This repo was built using Node v20.4.0. It is recommended using this version to run the project.

You will need to initialise NPM from the root of the repo file structure and install the following package dependencies:
- dotenv (v16.3.1)
- express (v4.18.2)
- pg (v8.7.3)

Before seeding data, you will need the following Node packages installed as a developer dependency:
- pg-format (v1.0.4)

### Configuring the Environment Variables

A test database and a development database have been provided in this repository. To connect to and use these databases you'll need to copy and paste the following code into their respective files at the root of the file structure:

#### env.test
```PGDATABASE=nc_news_test```

#### env.development
```PGDATABASE=nc_news```

### Seeding the Database

#### Create the Database
A script is provided for setting up the database (or, if needs must, wiping it completely and starting again): this is ```npm run setup-dbs``` in your CLI. Be aware if you run this script, it drops the database before creating it - you will need to seed data after running this command.

#### Run the Seed Script
A seed script is provided for seeding the database - ```npm run seed```. Unless you are running a test environment, it will default to seeding the development data. A Jest testing suite is also provided in this package that has a seed script running before each test - it will seed the test data in this case.

### Testing Suite
This repo was tested using Jest v27.5.1. If you intend to run the testing suite, you will need to install the following Node packages as dev dependencies:
- Jest v27.5.1
- Jest Sorted v1.0.14 (refer to [jest-sorted documentation](https://www.npmjs.com/package/jest-sorted) to ensure your package.json is configured correctly).
- Supertest v6.3.4

## Thanks...
...for looking at this stuff. I thought it was a cool thing to make.
