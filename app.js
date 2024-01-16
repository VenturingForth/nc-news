const express = require('express');
const app = express();

const { getApi } = require("./controllers/api-controllers.js");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getArticles,
        getArticleById,
        getArticleComments } = require("./controllers/articles-controllers.js");

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

//Unavailable Route (404) Error Handling
app.all('*', (req, res) => {
    res.status(404).send({msg: "Invalid Endpoint"});
})

//Invalid ID (400) Error Handling
app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    } else {
        next(err);
    }
})

//Not Found (404) Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    if(err.status === 404){
        res.status(404).send({msg: err.msg});
    } else {
        next(err);
    }
})

//Internal Error (500) Handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal error: check your code."});
})

module.exports = app;