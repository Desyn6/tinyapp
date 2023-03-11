const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "USER1",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "USER2",
  },
};

// Original unhashed version to show how hashPassword is generated
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);

// const users = {
//   USER1: {
//     id: "USER1",
//     email: "u1@u1.com",
//     hashedPassword: bcrypt.hashSync("u1", salt),
//   },
//   USER2: {
//     id: "USER2",
//     email: "u2@u2.com",
//     hashedPassword: bcrypt.hashSync("u2", salt),
//   }
// };

const users = {
  USER1: {
    id: "USER1",
    email: "u1@u1.com",
    hashedPassword: "$2a$10$USvbv5BDAaE1G5XlgALTKO63IDvqN8RZzMlvDEjF9SZVafAnjUGiO",
  },
  USER2: {
    id: "USER2",
    email: "u2@u2.com",
    hashedPassword: "$2a$10$USvbv5BDAaE1G5XlgALTKO9jBHxYtE9EIEkhg/.lr4HLl/oW8yypu",
  }
};

module.exports = { urlDatabase, users };