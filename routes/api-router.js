const apiRouter = require('express').Router();

const { getApi } = require('../controllers/api-controllers.js');
const { topicsRouter } = require('./topics-router.js');
const { articlesRouter } = require('./articles-router.js');

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;