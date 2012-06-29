#!/usr/bin/env node
var fs = require('fs');
var path = require('path')
var util = require("../lib/util.js");
var Parser = require("../lib/parser.js");
var Translator = require("../lib/translator.js");

var parser = new Parser();
parser.setSwitches([
  {name: 'file'},
  {name: 'template', default: path.join(__dirname,'../incl/template.jade')},
  {name: 'output', default: 'html'},
  {name: 'pipe', type: 'boolean', default: false},
]);
var results = parser.parse(process.argv).getResults();

if (results.file) {
  var translator = new Translator();
  var jsonfile = Translator.readJSON(results.file);
  var vars = {
    username: jsonfile[0].user.screen_name,
    tweets: jsonfile
  };
  var output = translator.setVariables(vars).render('html', results.template);

  if (results.pipe)
    console.log(output);
  else
    fs.writeFileSync("tweets_" + util.formatDate() + "." + results.output, output);
} else
  console.error("Use -f switch to define a file to compile");