const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(!err) console.log("Connected to DB"); 
});

const articleSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    } ,
    content : {
        type : String,
        required : true
    }
})

// const articleSchema = {
//     title: String,
//     content: String
// };

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res){
    res.send("<h1>Hello</h1>");
});

//<------------------------------------------- routes for All article ---------------------------------------->//

app.route("/articles")

    .get(function(req, res){                            // desc : Get all articles.         
        Article.find({}, (err, foundArticles) => {
            res.send(foundArticles);
        })
    })

    .post(function(req, res) {                          // desc :  Post an article.
        const article =  new Article({
            title : req.body.title,
            content :  req.body.content
        });

        article.save(function(err) {
            if(!err) res.send(err);
        });

        res.send(article);
    })

    .delete(function(req, res){                          //desc : delete an article by title
        Article.deleteMany({}, function(err){
            if(!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

//<---------------------------------------- routes for a Specific article  ------------------------------------->//

app.route("/article/:articleTitle")

    .get(function(req, res) {

        Article.findOne({title : req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("Article not found. !");
            }
        });
    })

    .put(function(req, res) {

        Article.update({title: req.params.articleTitle}, 
            {title : req.body.title, content : req.body.content},
            {overwrite : true},
            function(err){
                if(!err){
                    res.send("Successfully updated and overwritten");
                }
            }
        );
    })

    .patch(function(req, res) {
        
        Article.update(
            {title: req.params.articleTitle}, 
            {$set : req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req, res) {

        Article.deleteOne({title : req.params.articleTitle}, (err) => {
            if(!err){
                res.send("Successfully deleted : " + req.params.articleTitle);
            } else {
                res.send(err);
            }
        })
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});