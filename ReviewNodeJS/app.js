var express = require("express");
var app = express();
var path = require("path");

const engines = require("consolidate");
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));

var bodyParser = require("body-parser");
const { text } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.render("index");
});
fs = require("fs");
var fileName = "user.txt";
app.post("/doAdd", (req, res) => {
	let name = req.body.txtName;
	let password = req.body.txtPassword;
	let errorName = null;
	let errorPassword = null;
	if (name.length <= 3) {
		errorName = "name's lenght must be more than 3";
	}
	if (password.length <= 6) {
		errorPassword = "password's length must be more than 6";
	}
	if (errorName != null || errorPassword != null) {
		let errorData = { username: errorName, password: errorPassword };
		res.render("index", { error: errorData });
		return;
	}
	let user = name + ";" + password;
	fs.appendFileSync(fileName, "/" + user);
	//redirect user to index
	res.redirect("/");
});
app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	let name = req.body.txtName;
	let password = req.body.txtPassword;
	let textFile = fs.readFileSync(fileName, "utf8");
	users = textFile.split("/");
	//remove the first element bacause it is empty
	users.shift();
	users.forEach((element) => {
		nameF = element.split(";")[0];
		passF = element.split(";")[1];
		if (name == nameF && password == passF) {
			res.end("Valid user!");
			return;
		}
	});
	res.end("Invalid user!");
});

var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server is running at PORT" + PORT);
