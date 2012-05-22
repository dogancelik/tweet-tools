var path = require("path");
var fs = require("fs");
var jade = require("jade");

function Translator () {
  var _vars = {};
  var _compilers = [];

  function _addCompiler (name, callback) {
    _compilers[name.toLowerCase()] = callback;
  }

  function _init () {
    _addCompiler('html', function (vars, template_path) {
      var template_file = fs.readFileSync(template_path, "utf8");
      var render = jade.compile(template_file, { filename: template_path, pretty: true });
      return render(vars);
    });
  }

  this.setVariables = function (variables) {
    for (var key in variables) {
      _vars[key] = variables[key];
    }
    return this;
  };

  this.render = function (output_type, template_path) {
    return _compilers[output_type.toLowerCase()].call(null, _vars, template_path);
  };

  _init();
}

module.exports = Translator;

function readJSON (anything) {
  var json;

  if (typeof anything === "string") {
    var stats = fs.statSync(anything);

    if (stats.isFile())
      json = JSON.parse(fs.readFileSync(anything));
    else {
      try {
        json = JSON.parse(anything);
      } catch(err) {
        throw err;
      }
    }
  } else if (typeof anything === "object")
    json = anything;

  return json;
}

module.exports.readJSON = readJSON;
