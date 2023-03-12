// Dependencies
const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();

// set server defaults
const PORT = 8080; // default port 8080

// Call dependencies
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000,
}));

// required functions and DB
const {
  generateRandomString,
  findUser,
  urlsForUser
} = require('./functions');
const { urlDatabase, users } = require('./database');


// GET ROUTES BELOW
// route for main URL display
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send('Forbidden - please login or create an account!');
  } else {
    const user = users[req.session.user_id]; // fetch full user object
    const urls = urlsForUser(urlDatabase, user.id); // get user's URLs
    const templateVars = { urls, user };
    res.render("urls_index", templateVars);
  }
});

// route to registration page
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const user = users[req.session.user_id]; // fetch full user object
    const templateVars = { user };
    res.render("user_registration", templateVars);
  }
});

// route to registration page
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const user = users[req.session.user_id]; // fetch full user object
    const templateVars = { user };
    res.render("user_login", templateVars);
  }
});

// route to page for adding new URL
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const user = users[req.session.user_id]; // fetch full user object
    const templateVars = { user };
    res.render("urls_new", templateVars);
  }
});

// route to redirect to URL page for editing
app.get("/urls/:id/edit", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const shortURL = req.params.id;
    res.redirect(`/urls/${shortURL}`);
  }
});

// route for specific URL page, showing long URL
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session.user_id;

  if (!urlDatabase[shortURL]) {
    res.status(404).send(`Shortened URL /urls/${req.params.id} not found.`);

  } else if (!userID) {
    res.status(403).send(`Forbidden - please log in if you are the owner of this shortened link.`);

  } else if (userID !== urlDatabase[shortURL].userID) {
    res.status(403).send('Forbidden - incorrect credentials to view page.');

  } else {
    const longURL = urlDatabase[req.params.id].longURL; // fetch long URL
    const user = users[userID]; // fetch full user object
    const templateVars = { id: req.params.id, longURL, user };
    res.render("urls_show", templateVars);
  }
});

// route to redirect /u/:id to long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// route for url database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// dev route for checking users object
app.get("/users.json", (req, res) => {
  res.json(users);
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
  const hashedPassword = bcrypt.hashSync(req.body.password); // hashed password

  if (!email || !hashedPassword) {
    res.status(400).send('Status code 400: Please enter an e-mail address and password!');

  } else if (findUser(users, email)) {
    res.status(400).send(`Account using ${email} already exists! Please use a different e-mail address.`);

  } else {
    // write user to DB, set session cookie, redirect to urls page
    users[id] = { id, email, hashedPassword};
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

// route to receive newURL data
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send('You must be logged in to add URLs!');
  } else {
    const userID = req.session.user_id; // fetch user ID
    const longURL = req.body.longURL; // fetch submitted URL
    const newShortURL = generateRandomString(6);
    urlDatabase[newShortURL] = { longURL, userID }; // write to DB
    res.redirect(`/urls/${newShortURL}`);
  }
});

// route to POST login
app.post("/login", (req, res) => {
  // check for user via email
  const user = findUser(users, req.body.email);
  const hashedPassword = users[user].hashedPassword;
  const inputPassword = req.body.password;

  if (!user) {
    res.status(403).send('User does not exist!');

  } else if (!bcrypt.compareSync(inputPassword, hashedPassword)) {
    res.status(403).send('Incorrect password.');

  } else {
    // Store cookie and redirect to url page
    req.session.user_id = user;
    res.redirect("/urls");
  }
});

// route to POST logout
app.post("/logout", (req, res) => {
  // Delete cookie and redirect to login page
  req.session.user_id = null;
  res.redirect("/login");
});

// route to delete urls from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Link does not exist');
  
  } else if (!req.session.user_id) {
    res.status(403).send('Forbidden - you must be logged in to delete URLs!');

  } else if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    res.status(403).send('Forbidden - you can only edit your own links!');
    
  } else {
    // delete URL and redirect to urls page
    const shortURL = req.params.id;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// route to edit urls in urlDatabase
app.post("/urls/:id", (req, res) => {
  console.log(urlDatabase[req.params.id].userID, req.session.user_id);
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Link does not exist');

  } else if (!req.session.user_id) {
    res.status(403).send('Forbidden - you must be logged in to edit URLs!');

  } else if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    res.status(403).send('Forbidden - you can only edit your own links!');

  } else {
    // Overwrite URL and redirect to urls page
    const newURL = req.body.longURL;
    const shortURL = req.params.id;
    urlDatabase[shortURL].longURL = newURL;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});