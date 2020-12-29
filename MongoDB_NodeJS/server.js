var express = require("express");
var hbs = require("hbs");
var app = express();

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extend: false }));

app.get("/search", (req, res) => {
	res.render("search");
});
app.post("/doSearch", async (req, res) => {
	let nameSearch = req.body.txtName;
	let dbo = await connectMongoDB();
	let results = await dbo.collection("table").find({ productName: nameSearch }).toArray();
	res.render("index", { model: results });
});

app.get("/insert", (req, res) => {
	res.render("insert");
});
app.post("/doInsert", async (req, res) => {
	let nameInput = req.body.txtName;
	let colorInput = req.body.txtColor;
	let priceInput = req.body.txtPrice;
	let errorName = null;
	let errorColor = null;
	let errorPrice = null;
	if (nameInput.length < 3) {
		errorName = "Name must greater than 3 characters";
	}
	if (priceInput < 0) {
		errorPrice = "Price must greater than 0";
	}
	if (errorName != null || errorPrice != null) {
		let errorData = { name: errorName, price: errorPrice };
		res.render("insert", { error: errorData });
		return;
	} else {
		let newProduct = {
			productName: nameInput,
			color: colorInput,
			price: priceInput,
		};
		let dbo = await connectMongoDB();
		await dbo.collection("table").insertOne(newProduct);
		res.redirect("/");
	}
});

app.get("/edit", async (req, res) => {
	//id: string from URL
	let id = req.query.id;
	// convert id from URL to MongoDB id
	let ObjectID = require("mongodb").ObjectID(id);
	//the condition to edit
	let condition = { _id: ObjectID };
	// get the product by id
	let dbo = connectMongoDB();
	let prod = await dbo.collection("product").find(condition);
	res.render("edit", { model: prod });
});

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://toantom:toantom98@cluster0.ce433.mongodb.net/test";

app.get("/", async (req, res) => {
	let dbo = await connectMongoDB();
	let results = await dbo.collection("table").find({}).toArray();
	res.render("index", { model: results });
});

var PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log("Server is running at port " + PORT);

async function connectMongoDB() {
	let client = await MongoClient.connect(url);
	let dbo = client.db("ProductDB");
	return dbo;
}
