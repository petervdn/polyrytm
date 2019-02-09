import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true }); // suppresses a warning in the logs

const samplesCollection = 'samples'; // todo import consts from src

export const onFileAdded = functions.storage.object().onFinalize(object => {
  const splitName = object.name!.split('/');
  return admin
    .firestore()
    .collection(samplesCollection)
    .doc()
    .set({
      name: splitName[splitName.length - 1],
      path: object.name,
      size: parseInt(object.size, 10),
    });
});

export const onFileDeleted = functions.storage.object().onDelete(object => {
  console.log(`Delete where path == ${object.name}`);
  return admin
    .firestore()
    .collection(samplesCollection)
    .where('path', '==', object.name)
    .get()
    .then(snapshot => {
      if (snapshot.size === 1) {
        return snapshot.docs[0].ref.delete();
      } else {
        return Promise.reject(
          `Invalid amount (${snapshot.size}) of results for query: path == ${object.name}`,
        );
      }
    });
});
