//inputting code to make this work
const bodyParser = require("body-parser");
const { json } = require("express");
const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");
const { emailchecker } = require("./views/helpers");

//prereq stuff
let bcrypt = require("bcryptjs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const salt = bcrypt.genSaltSync(10);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//cookie implementation
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
//urldatabase object
let urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
};

let user1Password = "asdf";
//object for users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync(user1Password, salt),
  },
};
//redirects to
app.get("/", (req, res) => {
  let userID = req.session["user_id"];
  if (userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
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
  let userID = req.session["user_id"];

  const newVar = {};
  for (let url in urlDatabase) {
    if (userID === urlDatabase[url]["userID"]) {
      newVar[url] = urlDatabase[url];
    }
  }

  const templateVars = {
    urls: newVar,
    user: users[userID],
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  let userID = req.session["user_id"];

  const templateVars = { user: users[userID] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL].longURL;

  if (userID !== urlDatabase[shortURL]["userID"]) {
    return undefined;
  }
  const templateVars = {
    shortURL,
    longURL,
    user: users[userID],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const newfigure = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[newfigure] = {
    userID: req.session["user_id"],
    longURL,
  };
  res.redirect(`/urls/${newfigure}`);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  let newUrlDatabase = {
    longURL: longURL,
    userID: req.session["user_id"],
  };
  urlDatabase[shortURL] = newUrlDatabase;
  res.redirect(`/urls/`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

app.get("/register", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
    return;
  }
  res.render("register");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Registration credentials cannot be blank");
  }
  const user = emailchecker(email, users);
  if (user) {
    return res.status(400).send("Username/Email already taken");
  }
  const id = generateRandomString();
  users[id] = {
    id: id,
    email: email,
    password: password,
  };
  req.session["user_id"] = id;
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
    return;
  }
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Login credentials cannot be blank");
  }
  const user = emailchecker(email, users);
  if (!user) {
    return res.status(400).send("a user with that email does not exist...");
  }

  const doThePasswordsMatch = bcrypt.compareSync(
    password,
    users["userRandomID"]["password"]
  );
  if (!doThePasswordsMatch) {
    return { err: "Password is invalid", data: null };
  }
  req.session["user_id"] = user.id;
  res.redirect("/urls");
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
  return answer;
}

app.use(function (req, res, next) {
  res.status(400).send("Invalid login credentials");
});
