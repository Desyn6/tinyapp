const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

// Searches for a value in an object, returns true if found
const findUser = (usersObj, value) => {
  for (const user in usersObj) {
    for (const prop in usersObj[user]) {
      if (usersObj[user][prop] === value) return true;
    }
  }
  return false;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// route for main URL display
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

// route to registration page
app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user }
  res.render("user_registration", templateVars);
});

// route to POST /register
app.post("/register", (req, res) => {
  const id = generateRandomString(6);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('Status code 400: Please enter an e-mail address and password!');
  } else if (findUser(users, email)){
    res.status(400).send(`Account using ${email} already exists! Please use a different e-mail address.`);
  } else{
    users[id] = { id, email, password};
    res.cookie('user_id', id);
    res.redirect("/urls");
  }  
});

// route to page for adding new URL
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// route to receive newURL data
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = longURL;
  res.redirect(`/urls/${newShortURL}`);
});

// route to registration page
app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user }
  res.render("user_login", templateVars);
});

// route to POST login
app.post("/login", (req, res) => {
  res.send('Placeholder for login /POST')
});

// route to POST logout
app.post("/logout", (req, res ) => {
  // const username = req.body.username;
  res.clearCookie('username', users);
  res.redirect("/urls");
});

// route to redirect /u/:id to long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// route to delete urls from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// route to redirect to URL page for editing
app.get("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

// route to edit urls in urlDatabase
app.post("/urls/:id", (req, res) => {
  const newURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

// route for specific URL page, showing long URL
app.get("/urls/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  const user = users[req.cookies["user_id"]];
  console.log(user);
  console.log(users);
  const templateVars = { id: req.params.id, longURL, user };
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