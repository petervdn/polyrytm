const databaseUtils = require('./databaseUtils');

// todo get sample info (and store in db): length, stereo, etc
// todo check for valid file type

// todo unify with firebasePaths.js
const firebasePaths = {
	database: {
		USERS: 'users',
		ADMINS: 'admins',
		PUBLIC_RYTMS: 'public_rytms',
		PUBLIC_RYTMS_SHORT: 'public_rytms_short',
		PRIVATE_RYTMS: 'private_rytms',
		PRIVATE_RYTMS_SHORT: 'private_rytms_short',
		NOTIFICATIONS: 'notifications',
		PUBLIC_SAMPLES: 'samples/public',
		USER_SAMPLES: 'samples/user',
	},
	storage: {
		PUBLIC_SAMPLES: 'samples/public',
		USER_SAMPLES: 'samples/user',
	},
};

const getUserIdFromEvent = event => {
	const splitName = event.data.name.split('/');
	return splitName[splitName.length - 2];
};

const getFileNameFromEvent = event => {
	const splitName = event.data.name.split('/');
	return splitName[splitName.length - 1];
};

const onSamplesChange = (event, isPublic, admin) =>
	new Promise((resolve, reject) => {
		// determine paths in db & storage
		let databasePath;
		let storagePath;
		const userId = getUserIdFromEvent(event);
		if (isPublic) {
			databasePath = firebasePaths.database.PUBLIC_SAMPLES;
			storagePath = firebasePaths.storage.PUBLIC_SAMPLES;
		} else {
			databasePath = `${firebasePaths.database.USER_SAMPLES}/${userId}`;
			storagePath = `${firebasePaths.storage.USER_SAMPLES}/${userId}`;
		}

		const objectMetaData = event.data;
		const fileName = getFileNameFromEvent(event);
		const samplesRef = admin.database().ref(databasePath);

		databaseUtils.findByProperty(samplesRef, 'name', fileName).then(snapshot => {
			const dbValue = snapshot ? snapshot.val() : null;

			if (objectMetaData.resourceState === 'exists') {
				if (dbValue) {
					console.log(`Overwrite file: ${fileName} (in ${storagePath})`);
					resolve();
				} else {
					console.log(`Add new file: ${fileName} (in ${storagePath})`);

					samplesRef
						.push({
							link: objectMetaData.selfLink, // todo make this usable (some rights things i guess)
							name: fileName,
							path: storagePath, // todo rename this prop (and why is it even there, what does it do)
							size: parseInt(objectMetaData.size, 10),
						})
						.then(() => {
							resolve();
						});
				}
			} else {
				if (dbValue) {
					console.log(`File removed: ${fileName} (in ${storagePath})`);
					snapshot.ref.remove().then(() => {
						resolve();
					});
				} else {
					console.error(`File removed but doesnt exist in database: ${fileName} (in ${storagePath})`);
					console.error('metadata:', objectMetaData); // todo fix in 1 log (gives errors when deploying)
					reject();
				}
			}
		});
	});

// const onAvatarsChange = event =>
// 	new Promise(resolve => {
// 		console.log('avatars change', event);
// 		resolve();
// 	});

const onChange = (event, admin) => {
	const { name } = event.data;

	if (name.indexOf(firebasePaths.storage.USER_SAMPLES) === 0) {
		return onSamplesChange(event, false, admin);
	} else if (name.indexOf(firebasePaths.storage.PUBLIC_SAMPLES) === 0) {
		return onSamplesChange(event, true, admin);
	}

	// todo added files should be deleted?
	console.error(`Unhandled file change in storage`, event);
	return Promise.reject();
};

exports.onChange = onChange;
