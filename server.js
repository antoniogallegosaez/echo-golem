var express = require("express");
var bodyParser = require("body-parser");

var app = express();
//app.use(bodyParser.json());
app.use(bodyParser.text({type: '*/*'}));

app.post("/", function(req, res) {
  res.status(200).send(req.body);
});

app.listen(8080, function() {
  console.log("echo-golem listen to 8080");
});
