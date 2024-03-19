const apiRouter = require('express').Router();

const { getApi } = require('../controllers/api-controllers.js');

apiRouter.get("/", getApi);

module.exports = apiRouter;