/** Generates a random string of characters of specified length
 *
 * @param {number} length 
 * @returns {string} 
 */
const generateRandomString = (length) => {
  const charBank = "abcdefghijklmnopqrstuvwxyz1234567890";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    // access random value of charBank with Math Random, and round down
    randomString += charBank[Math.floor(charBank.length * (Math.random()))];
  }
  return randomString;
};

/** Searches usersObj for a value (e.g. password or e-mail)
 *  returns the username (string) if found, false otherwise
 *
 * @param {object} usersObj 
 * @param {string} value 
 * @returns {string or false}
 */
const findUser = (usersObj, value) => {
  for (const user in usersObj) {
    for (const prop in usersObj[user]) {
      if (usersObj[user][prop] === value) return user;
    }
  }
  return false;
};

/** Queries urlDB for URLs belonging to userID
 * 
 * @param {object} urlDB
 * @param {string} id
 * @returns {urlObject} {shortURL: longURL}
 */
const urlsForUser = (urlDB, id) => {
  const userURLs = {};
  for (const shortURL in urlDB) {
    if (urlDB[shortURL].userID === id) {
      userURLs[shortURL] = urlDB[shortURL].longURL;
    }
  }
  return userURLs;
};

module.exports = { generateRandomString, findUser, urlsForUser };