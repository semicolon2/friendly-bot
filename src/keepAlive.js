import http from "http";

export default function keepAlive() {
  setInterval(function() {
    http.get("http://whispering-cove-88085.herokuapp.com/");
  }, 1200000);
}
