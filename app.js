const express = require('express');
const app = express();

const { getApi } = require("./controllers/api-controllers.js");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getArticleById } = require("./controllers/articles-controllers.js");

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

//Unavailable Route (404) Error Handling
app.all('*', (req, res) => {
    res.status(404).send({msg: "Invalid Endpoint"});
})

//Internal Error (500) Handling
app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal error: check your code."});
})

module.exports = app;