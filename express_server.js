const bodyParser = require("body-parser");
const { json } = require("express");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(cookieParser());

let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let username = req.cookies["username"];

  console.log(username);
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let username = req.cookies["username"];
  const templateVars = { username: username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let username = req.cookies["username"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = {
    shortURL,
    longURL,
    username,
  };

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
  const newfigure = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[newfigure] = longURL;
  res.redirect(`/urls/${newfigure}`);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL); //res stands for response
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/`);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const user = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password,
  };
  const stringifyuser = JSON.stringify(user);
  users[user.id] = user;

  res.cookie("user_id", user.id);
  res.redirect(`/register`);
  console.log(users);
  console.log(user);
});

function generateRandomString() {
  let randomCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomResponse1 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let randomResponse2 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let randomResponse3 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let randomResponse4 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let randomResponse5 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let randomResponse6 =
    randomCharacters.split("")[Math.floor(Math.random() * 62)];
  let answer =
    randomResponse1 +
    randomResponse2 +
    randomResponse3 +
    randomResponse4 +
    randomResponse5 +
    randomResponse6;
  console.log(answer, "this is answer");
  return answer;
}
