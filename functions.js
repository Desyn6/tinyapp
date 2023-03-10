/** Generates a random string
  *  Input: 
  *    - a number to specify lenght of random string
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

/** Searches for a value in a user object
  *  Input: 
  *    - an object of users
  *    - a query value as a string (perfect match required)
  * 
  *  Returns:
  *    - a string containing the user name if found
  *    - false if not found
 */
const findUser = (usersObj, value) => {
  for (const user in usersObj) {
    for (const prop in usersObj[user]) {
      if (usersObj[user][prop] === value) return user;
    }
  }
  return false;
};

module.exports = { generateRandomString, findUser };