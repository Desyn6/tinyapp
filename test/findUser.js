const { assert } = require('chai');

const { getUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUser(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedUserID);
  });
  it('should return undefined for e-mails that does not exist', function() {
    const user = getUser(testUsers, "cheese@poots.com");
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });
  it('should ignore casing for a valid email', function() {
    const user = getUser(testUsers, "UsEr@ExAmPle.CoM");
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });
});