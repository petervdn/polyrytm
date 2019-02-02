import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
  console.log('request!');
});

// functions.auth.user().onCreate((user) => {
//   user.
// });
//
// export const createUser = functions.firestore
//   .document('users/{userId}')
//   .onCreate((snap, context) => {
//     console.log(snap.data());
//   });
