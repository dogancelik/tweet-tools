function ProcessArgsParser() {
  var _switches = [];
  var _regex;
  var _result;

  this.setSwitches = function (switches) {
    _switches = switches;
    return this;
  };

  function _parse (value, index, array) {
    var short_switch = _switches.filter(function(e) {
      return ("-" + e.name[0] === value);
    })[0];
    var inputval;
    var switch_name;

    if (!!short_switch) {
      inputval = array[++index];
      switch_name = short_switch.name;
    } else {
      var match;
      if (_regex.test(value)) {
        match = value.match(_regex);
        inputval = match[3];
        switch_name = match[1].toLowerCase();
      }
    }

    var foundswitch = _switches.filter(function (e) {
      return (e.name === switch_name);
    })[0];

    inputval = inputval ? inputval.toLowerCase() : false;

    if (foundswitch == undefined && inputval === false) return false;

    if (foundswitch && foundswitch.type === "boolean")
      _result[foundswitch.name] = true;
    else
      _result[foundswitch.name] = inputval;
  }

  this.parse = function (process_args) {
    _result = [];
    var defaults = _switches.filter(function (e) {
      return (typeof e.default === "undefined" ? false : true);
    });
    for (var object in defaults) {
      _result[defaults[object].name] = defaults[object].default;
    }

    _regex = new RegExp("--(" + _switches.map(function (e){return e.name;}).join("|") + ")(=(\\w+))?", "i");
    process_args.forEach(_parse);
    return this;
  };

  function Results (results) {
    var _results = results;

    this.get = function (switch_name) {
      if (switch_name in _results)
        return _results[switch_name];
      else
        return undefined; //throw new Error("Result '"+ switch_name +"' doesn't exist in this result set.");
    };

    this.asArray = function () {
      return _results;
    }

    return this;
  }

  this.getResults = function (safe) {
    safe = safe || 'safe';

    switch (safe) {
      case 'get':
        return new Results(_result);
        break;
      case 'array':
        return _result;
        break;
      case 'safe':
      default:
        var that = {};
        for (var switch_name in _result)
          that[switch_name.replace(/-/g,'_')] = _result[switch_name];
        return that;
        break;
    }
  };
}

module.exports = ProcessArgsParser;