var async  = require("async")
  , fs     = require("fs")
  , path   = require("path")
  , tweets = exports
  ;

tweets.write = function (tweets, cb) {
  var cb_fired = false;

  var queue = async.queue( function (tweet, next) {
    if(cb_fired) {
      return next();
    }

    var file_path = path.join(__dirname, "tweets", tweet.id + ".json");

    fs.writeFile(file_path, JSON.stringify(tweet, null, 2), function (e) {
      if(e) {
        if(!cb_fired) {
          cb(e);
        }
        cb_fired = true;
      } else {
        console.log("ok: %s", tweet.id);
      }
      next();
    });
  }, 2);

  queue.drain = function() {
    cb();
  };
  
  queue.push(tweets);
};
