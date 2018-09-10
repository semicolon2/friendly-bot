const http = require("http");

module.exports = function keepAlive() {
  setInterval(function() {
    http.get("http://whispering-cove-88085.herokuapp.com/");
  }, 1200000);
};
