var pad = function(number, length) {
  length = length || 2;
  var str = "" + number;
  while (str.length < length) str = "0" + str;
  return str;
};

var formatDate = function(date) {
  date = date || new Date();
  var bdate = ["getFullYear","getMonth","getDate","getHours","getMinutes","getSeconds"].map(function(e){ return pad(date[e].call(date)); });
  var adate = require("util").format.apply(null, ["%s-%s-%s_%s-%s-%s"].concat(bdate));
  return adate;
};

module.exports.formatDate = formatDate;