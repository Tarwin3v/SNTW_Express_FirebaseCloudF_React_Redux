const admin = require("firebase-admin");
const storage = require("../keys/firebaseConfig").storageBucket;

admin.initializeApp({
  credential: admin.credential.cert(require("../keys/adminSdk")),
  storageBucket: storage
});

const db = admin.firestore();

module.exports = { admin, db };
