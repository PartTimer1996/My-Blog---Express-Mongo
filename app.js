//jshint esversion:6

//all required NPM packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb+srv://Admin:Edenhazard69!@cluster0-b6puq.mongodb.net/test?retryWrites=true&w=majority/BlogsiteDB";

mongoose.connect(uristring, {useNewUrlParser: true}, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

const postSchema = {
  title:  String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts){
if (!err) {
  if (foundPosts.length === 0) {
    res.render("home", {
      startingContent: homeStartingContent,
      userPosts: posts
    });
  } else {
    res.render("home", {
      startingContent: homeStartingContent,
      userPosts: foundPosts
    });
  }
}
else{
  console.log(err);
  res.redirect("/");
}
  })
});

app.get("/about", function(req, res) {
  res.render("about", {
    startingContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    startingContent: contactContent
  });
})

app.get("/posts/:PostID", function(req, res) {
  const newID = req.params.PostID;

  Post.findOne({_id: newID}, function (err, foundPost) {
    if (!err){
      if(!foundPost){
        res.redirect("/");
        
      }else {
        res.render("post",
            {postTitle: foundPost.title,
              postContent: foundPost.content
            });
      }
      }
    });
  });


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;


  const post = new Post({
    title: postTitle,
    content: postContent
  });

  post.save(function(err){

    if (!err){

      res.redirect("/");

    }

  });
});

const port = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});