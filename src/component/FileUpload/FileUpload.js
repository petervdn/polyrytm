import * as firebase from 'firebase';
import firebaseError from 'firebase/firebaseError';
import firebasePath from 'firebase/firebasePath';

const fileState = {
	CHECKING: 'checking',
	UPLOADING: 'uploading',
	DONE: 'done',
	EXISTS: 'exists',
	CANCELLED: 'cancelled',
};

export default {
	name: 'FileUpload',
	props: ['file'],
	mounted() {
		const storage = firebase.storage();
		const userId = firebase.auth().currentUser.uid;
		const folderRef = storage.ref(`${firebasePath.storage.USER_SAMPLES}/${userId}`);
		this.fileRef = folderRef.child(this.file.name);

		this.fileRef
			.getMetadata()
			.then(() => {
				// todo what is the case here when does exist, but no permissions? (probably ends up in catch?)
				this.state = fileState.EXISTS;
			})
			.catch(error => {
				if (error.code === firebaseError.storage.OBJECT_NOT_FOUND) {
					this.upload();
				}
			});
	},
	data() {
		return {
			state: fileState.CHECKING,
			fileState,
			progress: 0,
		};
	},
	methods: {
		upload() {
			this.state = fileState.UPLOADING;

			this.uploadTask = this.fileRef.put(this.file);
			this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
				if (snapshot.bytesTransferred === snapshot.totalBytes) {
					this.state = fileState.DONE;
				}

				this.progress = 100 * (snapshot.bytesTransferred / snapshot.totalBytes);
			});
		},
		cancel() {
			this.state = fileState.CANCELLED;
		},
	},
};
