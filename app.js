const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router.js');
const cors = require('cors');

const { getApi } = require("./controllers/api-controllers.js");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getArticles,
        getArticleById,
        getArticleComments,
        postArticleComment,
        patchArticle } = require("./controllers/articles-controllers.js");
const { deleteComment } = require("./controllers/comments-controllers.js");
const { getUsers } = require("./controllers/users-controllers.js")

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);

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
    if(err.status === 404){
        res.status(404).send({msg: err.msg});
    } else {
        next(err);
    }
})

//Bad Request (400) Error Handling
app.use((err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send({msg: err.msg})
    } else{
        next(err);
    }
})

//Foreign Key Constraint (404) Error Handling
app.use((err, req, res, next) => {
    const errDetail = err.detail.split(' ');
    if(err.code === "23503" && errDetail[errDetail.length - 1] === `"articles".`){
        res.status(404).send({msg: "Article ID not found"});
    } else if (err.code === "23503" && errDetail[errDetail.length - 1] === `"users".`){
        res.status(404).send({msg: "Username not found"});
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