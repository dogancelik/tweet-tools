var https = require("https");
var url = require("url");
var async = require("async");

function AsyncTweetDownloader() {
  var _url = "https://api.twitter.com/1/statuses/user_timeline.json?\
include_entities=true&\
include_rts=true&\
count=200&\
page=__page__&";
  var _tempurl;
  var _debug = false;

  this.setScreenName = function (screen_name) {
    _tempurl = _url + "screen_name=" + screen_name;
    return this;
  };

  this.setUserId = function (user_id) {
    _tempurl = _url + "user_id=" + user_id;
    return this;
  };

  function _download (i, callback) {
    var options = url.parse(_tempurl.replace("__page__", "" + i), true);
    var finaldata = "";
    https.get(options,function (res) {
        res.on("data", function (data) {
          finaldata += data;
        }).on("end", function() {
          callback(null, finaldata);  
        });
    })
  };

  function _fakeDownload (i, callback) {
    callback(null, JSON.stringify({
      id: i,
      user: { name: "User Name", screen_name: "username" },
      text: "Test message: "+ i 
    }));
  };

  this.debug = function (bool) {
    _debug = (bool == true ? true : false);
    return this;
  };

  function _getDownloadStack () {
    var downloads = [];
      for (var i = 1; i <= 16; i++)
        downloads.push(async.apply(_debug ? _fakeDownload : _download, i));
    return downloads;
  }

  function _concatJSON (array) {
    var data = [];
    array.forEach(function (val) {
      data = data.concat(JSON.parse(val));
    });
    return data;
  }
  
  this.download = function (callback) {
    async.parallel(_getDownloadStack(), function (err, ret) {
      callback(err, _concatJSON(ret));
    });
  };
}

module.exports = AsyncTweetDownloader;