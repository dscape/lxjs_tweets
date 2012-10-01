/*
 * @TenConf
 * 
 * Full text search in JS in 10 minutes
 * By Nuno Job
 *
 * Start off here
 */
var request      = require("request")
  , tweets       = require("./tweets")
  , search       = exports
  ;

var all_tweets = [];

search.twitter = function (qs, cb) {
  if(typeof qs === "function") {
    cb   = qs;
    qs = null;
  }

  qs = qs ? qs : "?q=lxjs&rpp=100";

  console.log("searching: %s", qs);

  var get = 
    { "uri" : "http://search.twitter.com/search.json" + qs
    , "json": "true"
    };

  request(get, function (e, _, r){
    if(e) {
      console.log(e);
      console.log("error: %s", e.message);
      process.exit(1);
    }

    var next_page = r.next_page
      , results   = r.results
      ;

    if(Array.isArray(results)) {
      tweets.write(results, function (err) {
        if(err) {
          console.log("error: on page %s", qs);
          console.log(err);
        }
      });
    }

    if(next_page) {
      return search.twitter(next_page, cb);
    }

    cb(all_tweets);
  });
};

search.twitter(function (results) {
  console.log("done");
});
