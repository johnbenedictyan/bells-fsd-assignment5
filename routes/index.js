var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/employees/:id/delete", function (req, res, next) {
  res.render("employee-delete", { name: "Yehuda Katz2 mean" });
});

router.post("/employees/:id/delete", function (req, res, next) {
  //   res.render("employee");
});

router.get("/employees/:id/edit", function (req, res, next) {
  res.render("employee-edit");
});

router.post("/employees/:id/edit", function (req, res, next) {
  //   res.render("employee");
});

router.get("/employees/:id", function (req, res, next) {
  res.render("employee");
});

router.get("/", function (req, res, next) {
  res.render("index", {
    people: [
      {
        id: 1,
        name: "Yehuda Katz",
        title: "Software Developer",
        email: "yehudakatz@acme.com",
        company: "acme",
      },
      {
        id: 2,
        name: "Alan Johnson",
        title: "Software Developer",
        email: "alanjohnson@acme.com",
        company: "acme",
      },
      {
        id: 3,
        name: "Charles Jolley",
        title: "Software Developer",
        email: "charlesjolley@acme.com",
        company: "acme",
      },
    ],
  });
});

module.exports = router;
