var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Handlebars = require("handlebars");
const wax = require("wax-on");
const { createConnection } = require("mysql2/promise");

require("dotenv").config();

// register Wax On helpers with Handlebars
wax.on(Handlebars);
wax.setLayoutPath("/views");

var app = express();

async function main() {
  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "hbs");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  let connection;

  connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  /* GET home page. */
  app.get("/employees/add", async function (req, res, next) {
    let [companies] = await connection.execute("SELECT * FROM Companies;");

    res.render("employee-add", { companies });
  });

  app.post("/employees/add", async function (req, res, next) {
    let { name, title, email, companyId } = req.body;
    let query =
      "INSERT INTO Employees (name, title, email, company_id) VALUES (?,?,?,?)";
    let bindings = [name, title, email, companyId];
    await connection.execute(query, bindings);

    res.redirect("/");
  });

  app.get("/employees/:id", async function (req, res, next) {
    let [employees] = await connection.execute(
      "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.company_id=Companies.id AND Employees.id = ?;",
      [req.params.id]
    );

    console.log(employees[0]);

    res.render("employee", { employee: employees[0] });
  });

  app.get("/employees/:id/delete", async function (req, res, next) {
    let [employees] = await connection.execute(
      "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.id = ?;",
      [req.params.id]
    );

    res.render("employee-delete", { employee: employees[0] });
  });

  app.post("/employees/:id/delete", async function (req, res, next) {
    await connection.execute("DELETE FROM Employees WHERE id = ?", [
      req.params.id,
    ]);
    res.redirect("/");
  });

  app.get("/employees/:id/edit", async function (req, res, next) {
    let [companies] = await connection.execute("SELECT * FROM Companies;");
    let [employees] = await connection.execute(
      "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.company_id=Companies.id AND Employees.id = ?;",
      [req.params.id]
    );

    res.render("employee-edit", {
      employee: employees[0],
      companies: companies.filter((x) => x.id != employees[0].companyId),
      selectedCompany: companies.filter(
        (x) => x.id == employees[0].companyId
      )[0],
    });
  });

  app.post("/employees/:id/edit", async function (req, res, next) {
    let { name, title, email, companyId } = req.body;
    let query =
      "UPDATE Employees SET name=?, title=?, email=?, company_id=? WHERE id=?";
    let bindings = [name, title, email, companyId, req.params.id];
    await connection.execute(query, bindings);

    res.redirect("/employees/" + req.params.id);
  });

  app.get("/employees/:id", async function (req, res, next) {
    let [employees] = await connection.execute(
      "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.company_id=Companies.id AND Employees.id = ?;",
      [req.params.id]
    );

    console.log(employees[0]);

    res.render("employee", { employee: employees[0] });
  });

  app.get("/", async function (req, res, next) {
    const { companyId, name } = req.query;

    let e;

    if (companyId || name) {
      let [employees] = await connection.execute(
        "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.company_id=Companies.id AND Employees.company_id=? AND Employees.name LIKE ?;",
        [req.query.companyId, "%" + req.query.name + "%"]
      );
      e = employees;
    } else {
      let [employees] = await connection.execute(
        "SELECT Employees.id AS id, Employees.name AS name, Employees.title AS title, Employees.email AS email, Companies.name AS companyName, Companies.id AS companyId FROM Employees JOIN Companies WHERE Employees.company_id=Companies.id;"
      );
      e = employees;
    }

    let [companies] = await connection.execute("SELECT * FROM Companies;");

    res.render("index", { employees: e, companies });
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
}

main();

module.exports = app;
