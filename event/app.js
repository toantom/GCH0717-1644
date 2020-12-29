var express = require("express");
var app = express();
var path = require("path");

var bodyParser = require("body-parser");
const { text } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));

const engines = require("consolidate");
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
	res.render("event");
});

app.post("/event", (req, res) => {
	let name = req.body.name;
	let date = req.body.date;
	let gender = req.body.gender;
	let errorName = null;
	let errorDate = null;
	let errorGender = null;

	if (name == "") {
		errorName = "Name can not be null";
	}
	if (date == "") {
		errorDate = "Date can not be null";
	}
	if (gender == null) {
		errorGender = "Gender must be selected";
	}
	if (errorName != null || errorDate != null || errorGender != null) {
		let errorData = { name: errorName, date: errorDate, gender: errorGender };
		res.render("event", { error: errorData });
		return;
	}
	res.redirect("/");
});

var PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log("Server is running at port " + PORT);
