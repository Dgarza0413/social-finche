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
                cheeps.push(doc.data());
            });
            return res.json(cheeps);
        })
        .catch(err => console.error(err));
});

exports.createCheep = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "Method not allowed" })
    }
    const newCheep = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
exports.api = functions.https.onRequest(app);