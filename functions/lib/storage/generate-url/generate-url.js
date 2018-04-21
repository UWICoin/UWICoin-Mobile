"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
exports.generateURL = functions.storage.bucket('/images/users').object().onChange(event => {
    const gcs = require('@google-cloud/storage')();
    const object = event.data;
    const fileBucket = object.bucket; // the storage bucket that contains the file
    const filePath = object.name; // the file path in the bucket
    const contentType = object.contentType; // the file content type
    const resourceState = object.resourceState; // the resourceState is 'exists' or 'not_exists' for file or folder deletions
    if (!contentType.startsWith('base64/') || resourceState == 'not_exists') {
        console.log('This is not an image');
        return;
    }
    const fileName = filePath.split('/images/users/').pop(); // the name of the file
    const uid = fileName; // the uid of the user submitting the file ie the name of the file
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    return bucket.file(filePath).download({
        destination: tempFilePath
    }).then(() => {
        return admin.database().ref(`users/${uid}`).set({ photoURL: tempFilePath }).then(() => {
            console.log('Image loaded successfully');
        });
    });
});
//# sourceMappingURL=generate-url.js.map