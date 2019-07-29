//when deploying this app deploy in this functions folder using firebase deploy
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require("express");
const app = express();

const config = {
    apiKey: "AIzaSyBYluZyjauAF-PCDoAEGGgz3w2qqwYWe6M",
    authDomain: "social-finche.firebaseapp.com",
    databaseURL: "https://social-finche.firebaseio.com",
    projectId: "social-finche",
    storageBucket: "social-finche.appspot.com",
    messagingSenderId: "866202848524",
    appId: "1:866202848524:web:711502b723a4e6a5"
};

//this is a method used by firebase
admin.initializeApp();

const firebase = require("firebase");
firebase.initializeApp(config)

const db = admin.firestore();

//template of how our functions will be exported in firebase
app.get("/cheeps", (req, res) => {
    db.collection('cheeps')
        .get()
        .then((data) => {
            let cheeps = [];
            data.forEach((doc) => {
                cheeps.push({
                    cheepId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
                });
            });
            return res.json(cheeps);
        })
        .catch(err => console.error(err));
});

app.post("/cheep", (req, res) => {
    const newCheep = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    db.collection('cheeps')
        .add(newCheep)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    db.doc(`/users/${newUser.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        }).then((data) => {
            return data.user.getIdToken();
        }).then((token) => {
            return res.status(201).json({ token });
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});


// https: //baseurl.com/api/
// if you want to change the region of where your requests go
// use .region("europe-west1") for example
exports.api = functions.https.onRequest(app);