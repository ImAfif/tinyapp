const bodyParser = require("body-parser");
const { json } = require("express");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); // serve up static files in the public directory
app.use(cookieParser());

app.set("view engine", "ejs");

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
    password: "asdf",
  },
};

let emailchecker = (email) => {
  let var1 = "";
  let var2 = "";
  for (let userid in users) {
    const user = users[userid];
    if (user.email === email) {
      return user;
    }
  }
  return null;
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
  let userID = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userID],
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user_id"];
  const templateVars = { user: users[userID] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let userID = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = {
    shortURL,
    longURL,
    user: users[userID],
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

app.post("/logout", (req, res) => {
  res.clearCookie("user.id");
  res.clearCookie("user_id");
  res.redirect(`/login`);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  if (!email || !password) {
    return res.status(400).send("Registration credentials cannot be blank");
  }
  const user = emailchecker(email);

  if (user) {
    return res.status(400).send("Username/Email already taken");
  }

  const id = generateRandomString;

  users[id] = {
    id: id,
    email: email,
    password: password,
  };

  console.log("users", users);

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Login credentials cannot be blank");
  }
  const user = emailchecker(email);

  console.log("user", user);

  if (!user) {
    return res.status(400).send("a user with that email does not exist...");
  }

  if (user.password !== password) {
    return res.status(400).send("Password is invalid");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// app.post("/login", (req, res) => {
//   const username = req.params.email;
//   res.cookie("username", username);
//   res.redirect(`/login`);
// });
// app.post("/login", (req, res) => {
//   res.redirect(`/login`);
// });
// if (user.email === "" || user.password === "") {
//   res
//     .status(400)
//     .send(
//       "Invalid, login credentials cannot be empty. Check your email and password for emtpy input."
//     );
// }
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

app.use(function (req, res, next) {
  res.status(400).send("Invalid login credentials");
});
