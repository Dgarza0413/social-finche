const functions = require('firebase-functions');
const admin = require('firebase-admin');

//this is a method used by firebase
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//looks like exports similar for other 
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello world!");
});

//template of how our functions will be exported in firebase
exports.getCheeps = functions.https.onRequest((req, res) => {
    admin.firestore().collection("cheeps").get().then(data => {
        let cheeps = [];
        data.forEach(doc => {
            cheeps.push(doc.data());
        });
        return res.json(cheeps);
    })
        .catch(err => console.error(err))
})

exports.createCheep = functions.https.onRequest((req, res) => {
    const newCheep = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
        .collection('cheeps')
        .add(newCheep)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});