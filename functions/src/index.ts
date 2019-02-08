import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true }); // supresses a warning the logs

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

/*
 bucket: 'polyrytm.appspot.com',
  contentDisposition: 'inline; filename*=utf-8\'\'amb_main.mp3',
  contentType: 'audio/mp3',
  crc32c: '064fsg==',
  etag: 'CNfiqo2poOACEAE=',
  generation: '1549222917353815',
  id: 'polyrytm.appspot.com/samples/xZqcfdpewYU0CSKGBjBdN0P3Yk33/amb_main.mp3/1549222917353815',
  kind: 'storage#object',
  md5Hash: 'fGbzEy9tbfkTqPFow9eTlA==',
  mediaLink: 'https://www.googleapis.com/download/storage/v1/b/polyrytm.appspot.com/o/samples%2FxZqcfdpewYU0CSKGBjBdN0P3Yk33%2Famb_main.mp3?generation=1549222917353815&alt=media',
  metadata: { firebaseStorageDownloadTokens: 'bee90617-8211-4156-b8fb-7de1b852b639' },
  metageneration: '1',
  name: 'samples/xZqcfdpewYU0CSKGBjBdN0P3Yk33/amb_main.mp3',
  selfLink: 'https://www.googleapis.com/storage/v1/b/polyrytm.appspot.com/o/samples%2FxZqcfdpewYU0CSKGBjBdN0P3Yk33%2Famb_main.mp3',
  size: '517495',
  storageClass: 'STANDARD',
  timeCreated: '2019-02-03T19:41:57.353Z',
  timeStorageClassUpdated: '2019-02-03T19:41:57.353Z',
  updated: '2019-02-03T19:41:57.353Z' }
 */
