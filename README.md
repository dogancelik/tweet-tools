# tweet-tools
tweet-tools is a set of tools for your tweets.

## How to install
### First way

    git clone git://github.com/dogancelik/tweet-tools.git
    cd tweet-tools
    git submodule init
    git submodule update
    sudo npm link .

### Second way
I'm not sure about this one...

    sudo npm link git://github.com/dogancelik/tweet-tools.git

## tweet-backup
tweet-backup will save your last 3200 tweets in your Twitter account to a JSON file. It uses Twitter API to fetch tweets.

Available switches are:
* -s yourscreenname, --screen-name=... (you have to use either this or user id switch)
* -u youruserid, --user-id=...
* -p, --pipe (for piping, disabled by default)
* -o outputtype, --output=... (default and right now the only output type is JSON)
* -d, --debug (this will generate a fake JSON file to test tweet-compile)

### Example usage
If your Twitter name is @username then

    tweet-backup -s username

This will get generate a JSON file (something like this: `tweets_2012-04-23_23-05-14.json`)

## tweet-compile
tweet-compile will compile your JSON file and turn it to well formatted HTML file. It uses to Jade template engine to compile.

Available switches are:
* -f, --file
* -t, --template (default is './incl/template.jade' in your tweet-tools folder)
* -o, --output (default is HTML, this is just for prototyping, I didn't add any other output type, so it's only HTML for now.)
* -p, --pipe (for piping the output)

### Example usage

    tweet-compile -f tweets_2012-04-23_23-05-14.json

This will generate a HTML file for your JSON file. (something like this: `tweets_2012-04-23_23-05-14.html`)

### incl/template.jade
This is your template for generating HTML files from your JSON files. You can learn how to use it [here](https://github.com/visionmedia/jade).

In order to edit the template you may also need to learn the structure of the tweet object.
So basically it is like this:

Example tweet **object array** for @username:

    [...,
    {
      ...,
      user: { screen_name: 'username', id: 123456789},
      text: 'hello twitter!'
      ...
    }
    ...]

The example shown above is a **basic** structure of a tweet object, If you want learn more stuff about a tweet object, [you can read here](https://dev.twitter.com/docs/api/1/get/statuses/user_timeline)