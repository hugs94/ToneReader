var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

app.use(express.static(__dirname + "/front-end/build"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: false }));

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var toneAnalyzer = new ToneAnalyzerV3({
  version: process.env.VER,
  url: process.env.URLLINK,
  username: process.env.USERN,
  password: process.env.PW
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
