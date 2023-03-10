const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

// required functions and DB
const { generateRandomString, findUser} = require('./functions');
const { urlDatabase, users } = require('./database');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// GET ROUTES BELOW
// route for main URL display
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

// route to registration page
app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user };
  res.render("user_registration", templateVars);
});

// route to registration page
app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user };
  res.render("user_login", templateVars);
});

// route to page for adding new URL
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// route to redirect to URL page for editing
app.get("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

// route for specific URL page, showing long URL
app.get("/urls/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  const user = users[req.cookies["user_id"]];
  const templateVars = { id: req.params.id, longURL, user };
  res.render("urls_show", templateVars);
});

// route to redirect /u/:id to long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
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

// POST ROUTES BELOW
// route to POST /register
app.post("/register", (req, res) => {
  const id = generateRandomString(6);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('Status code 400: Please enter an e-mail address and password!');
  } else if (findUser(users, email)) {
    res.status(400).send(`Account using ${email} already exists! Please use a different e-mail address.`);
  } else {
    users[id] = { id, email, password};
    res.cookie('user_id', id);
    res.redirect("/urls");
  }
});

// route to receive newURL data
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = longURL;
  res.redirect(`/urls/${newShortURL}`);
});

// route to POST login
app.post("/login", (req, res) => {
  // check for user via email
  const user = findUser(users, req.body.email);
  if (!user) {
    res.status(403).send('User does not exist!');
  } if (req.body.password !== users[user].password) {
    res.status(403).send('Incorrect password.');
  } else {
    res.cookie('user_id', user).redirect("/urls");
  }
});

// route to POST logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id', users);
  res.redirect("/login");
});

// route to delete urls from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// route to edit urls in urlDatabase
app.post("/urls/:id", (req, res) => {
  const newURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});