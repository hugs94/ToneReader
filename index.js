var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

app.use(express.static(__dirname + "/tone-chat-front/build"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: false }));

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var toneAnalyzer = new ToneAnalyzerV3({
  version: "2017-09-21",
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  username: "e1bb33f9-f17e-4ada-a17d-c17be96ee62b",
  password: "AkLEGacK6I8X"
});

app.post("/api/tone", function(req, res, next) {
  let senderId = req.body.senderId;
  let room = req.body.room;
  toneAnalyzer.tone(req.body, function(err, data) {
    let returnData = { data: data, senderId: senderId, room: room };
    return err ? next(err) : res.status(200).json(returnData);
  });
});
app.listen(PORT, () => {
  console.log(`server is listening on PORT` + PORT);
});

module.exports = app;
