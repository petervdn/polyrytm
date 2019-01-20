const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
// const cookieParser = require('cookie-parser')();
const cors = require('cors');
const multer = require('multer');
const storage = require('./storage');

// const formData = require('express-form-data');
// const fileUpload = require('express-fileupload');

admin.initializeApp(functions.config().firebase);

exports.onStoreChange = functions.storage.object().onChange(event => storage.onChange(event, admin));
