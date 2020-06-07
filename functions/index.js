const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./utils/admin");
const {
  getHowls,
  addHowl,
  getHowl,
  likeHowl,
  unlikeHowl,
  addComment,
  deleteHowl
} = require("./handler/howls");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getUserData,
  getUserDetails,
  markNotificationsRead
} = require("./handler/users");
const authenticated = require("./utils/authenticated");

const app = express();

//@X ROUTES

//AUTH
app.post("/signup", signup);
app.post("/login", login);
//USER
app.get("/user", authenticated, getUserData);
app.get("/user/:handle", getUserDetails);
app.post("/user/image", authenticated, uploadImage);
app.post("/user", authenticated, addUserDetails);
app.post("/notifications", authenticated, markNotificationsRead);
//HOWLS
app.get("/howls", getHowls);
app.get("/howl/:howlId", getHowl);
app.post("/howl", authenticated, addHowl);
app.post("/howl/:howlId/comment", authenticated, addComment);
app.post("/howl/:howlId/like", authenticated, likeHowl);
app.post("/howl/:howlId/unlike", authenticated, unlikeHowl);
app.delete("/howl/:howlId", authenticated, deleteHowl);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/howls/${snapshot.data().howlId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            howlId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/howls/${snapshot.data().howlId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            howlId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change);
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection(`howls`)
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const howls = db.doc(`/howls/${doc.id}`);
            batch.update(howls, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch((err) => console.error(err));
    } else {
      return true;
    }
  });
exports.onHowlDelete = functions
  .region("europe-west1")
  .firestore.document("/howls/{howlId}")
  .onDelete((snapshot, context) => {
    const howlId = context.params.howlId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("howlId", "==", howlId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("howlId", "==", howlId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("howlId", "==", howlId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
