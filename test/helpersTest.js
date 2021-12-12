const { assert } = require("chai");

const { emailchecker } = require("../views/helpers");

const testUsers = {
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

describe("emailchecker", function () {
  it("should return a user with valid email", function () {
    const user = emailchecker("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    const expectedUserEmail = "user@example.com";
    const expectedUserPassword = "purple-monkey-dinosaur";
    // Write your assert statement here
    assert.equal(user.id, expectedUserID);
    assert.equal(user.email, expectedUserEmail);
    assert.equal(user.password, expectedUserPassword);
  });
});
