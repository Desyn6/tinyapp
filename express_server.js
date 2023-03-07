const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Generates a random string of length as specified in input
const generateRandomString = (length) => {
  const charBank = "abcdefghijklmnopqrstuvwxyz1234567890";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    // access random value of charBank with Math Random, and round down
    randomString += charBank[Math.floor(charBank.length * (Math.random()))];
  }
  return randomString;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// route for main URL display
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// route to page for adding new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// route to receive newURL data
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
})

// route for specific URL page, showing long URL
app.get("/urls/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  const templateVars = { id: req.params.id, longURL };
  res.render("urls_show", templateVars);
});

// route for url database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// home route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// example route for demonstrating express.get method
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});