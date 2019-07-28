//when deploying this app deploy in this functions folder using firebase deploy
const functions = require('firebase-functions');
const admin = require('firebase-admin');

//this is a method used by firebase
admin.initializeApp();

const express = require("express");
const app = express();

//template of how our functions will be exported in firebase
app.get("/cheeps", (req, res) => {
    admin
        .firestore().collection('cheeps')
        .get()
        .then((data) => {
            let cheeps = [];
            data.forEach((doc) => {
                cheeps.push({
                    cheepId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
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
    admin.firestore()
        .collection('cheeps')
        .add(newCheep)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});

// https: //baseurl.com/api/
// if you want to change the region of where your requests go
// use .region("europe-west1") for example
exports.api = functions.https.onRequest(app);