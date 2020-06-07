const firebase = require("firebase");
firebase.initializeApp(require("../keys/firebaseConfig"));

module.exports = { firebase };
