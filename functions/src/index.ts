import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true }); // supresses a warning the logs

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const addSampleToDatabase = functions.storage.object().onFinalize(object => {
  const splitName = object.name!.split('/');
  return admin
    .firestore()
    .collection('samples') // todo import consts
    .doc()
    .set({
      name: splitName[splitName.length - 1],
      path: object.name,
      size: parseInt(object.size, 10),
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
