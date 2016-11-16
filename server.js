var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.text({type: '*/*'}));

app.post("/", function(req, res) {
  var resp = req.body + '\n';
  res.status(200).send(resp);
});

app.listen(8080, function() {
  console.log("echo-golem listen to 8080");
});
