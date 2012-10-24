var package   = require("./package"),
    express   = require("express"),
    app       = express();

app.use(express.bodyParser());

app.set("view engine", "jade");

app.get(/\/(.+)/, function (req, res) {
    require("./"+req.params[0]).run(req, res);
});

app.listen(8080);
console.log("Running on port 8080");