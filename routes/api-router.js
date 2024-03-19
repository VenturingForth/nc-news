const apiRouter = require('express').Router();

const { getApi } = require('../controllers/api-controllers.js');
const { topicsRouter } = require('./topics-router.js');

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;