var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");

var PORT = 3000;

var app = express();

app.user(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
  useMongoClient: true
});

request("http://www.medium.com", function(error, response, html) {

  var $ = cheerio.load(html);

  var results = [];

  $(".u-flexColumnTop").each(function(i, element) {

    var link = $(element).find("a").attr("href");
    var headline = $(element).find(".ui-h3").text();
    var summary = $(element).find("h4.ui-summary").text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      headline: headline,
      link: link,
      summary: summary
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

