const admin = require('firebase-admin');
const argv = require('yargs').argv;

const email = argv.email;
const serviceAccountFile = argv.key;

if (!email) {
  console.error('Missing email address, use: --email=user@tomake.admin');
  process.exit(1);
}
if (!serviceAccountFile) {
  console.error('Missing path to service-account key, use: --key=../file.json');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(serviceAccountFile);
} catch (error) {
  console.error(`Error loading file: ${serviceAccountFile}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    if (user.customClaims && user.customClaims.admin === true) {
      console.log('User is already admin');
      process.exit();
    }
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`User with email ${email} is now admin`);
    process.exit();
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
