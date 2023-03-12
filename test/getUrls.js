const { assert } = require('chai');

const { urlsForUser } = require('../helpers.js');

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "USER1",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "USER2",
  },
  j6oCj4: {
    longURL: "https://www.facebook.com",
    userID: "USER1",
  }
};

describe('getURLsByID', function() {
  it('should return an empty object if there are no matches', function() {
    const urls = urlsForUser(urlDatabase, "USER3AWW");
    const expectedURLs = {};
    assert.deepEqual(urls, expectedURLs);
  });
  it('should return all urls belonging to a user', function() {
    const urls = urlsForUser(urlDatabase, "USER1");
    const expectedURLs = {
      b6UTxQ: "https://www.tsn.ca",
      j6oCj4: "https://www.facebook.com"
    };
    assert.deepEqual(urls, expectedURLs);
  });
});