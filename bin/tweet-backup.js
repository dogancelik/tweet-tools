#!/usr/bin/env node
var fs = require('fs');
var util = require("../lib/util.js");
var Parser = require("../lib/parser.js");
var Translator = require("../lib/translator.js");
var Downloader = require("../lib/downloader.js");

var parser = new Parser();
parser.setSwitches([
  {name: 'screen-name'},
  {name: 'user-id'},
  {name: 'pipe', type: 'boolean', default: false},
  {name: 'output', default: 'json'},
  {name: 'debug', type: 'boolean', default: false}
]);
var results = parser.parse(process.argv).getResults();

function downloadCallback (err, res) {
  if (!err) console.error("All tweets are loaded.");

  var jsonobj = res;
  var jsonstr = JSON.stringify(jsonobj);
  var finaloutput;

  switch (results.output) {
    case "json":
    default:
      finaloutput = jsonstr;
      break;
  }

  if (results.pipe)
    console.log(finaloutput);
  else {
    fs.writeFile("tweets_"+util.formatDate()+"."+results.output, finaloutput, function(err) {
      if (err) console.error("Write error:" + err);
      else console.error("Tweets are saved successfully.");

      if (results.debug)
        process.exit(0);
    });
  }
}

if (results.debug) {
  console.error("Debug mode on.");
  var downloader = new Downloader();
  downloader.debug(true).download(downloadCallback);
} else if (results.screen_name || results.user_id) {
  var downloader = new Downloader();

  if (results.screen_name)
    downloader.setScreenName(results.screen_name);
  else
    downloader.setUserId(results.user_id);

  downloader.download(downloadCallback);
} else {
  console.error("Error: Screen name or user id is required to archive tweets.");
}