import * as firebase from 'firebase/app';
import { TweenLite, Expo } from 'gsap';
import firebasePath from '../../firebase/firebasePath';

const FileState = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  UPLOAD_DONE: 'uploaded',
  EXISTS: 'exists',
  CANCELLED: 'cancelled',
  REMOVING: 'removing',
};

const FileType = {
  USER: 'user',
  UPLOAD: 'upload',
  BOTH: 'both',
};
// todo remove an item, then upload it => nothing happens?

// todo what happens if we upload, but for some reason it doesnt appear in db. is it correctly gone?
// (maybe show message?)
export default {
  name: 'UserSampleListItem',
  props: ['userFile', 'uploadFile', 'fileName', 'isPublic'],
  data() {
    return {
      FileState,
      FileType,
      fileState: FileState.IDLE,
      uploadProgress: 0,
      animatedFillWidth: 0,
    };
  },
  mounted() {
    if (this.fileType === FileType.UPLOAD) {
      // file is a new entry, we have to upload it
      this.upload();
    }

    this.animatedFillWidth = this.fillWidth;
  },
  watch: {
    fileType() {
      // todo comment pleeaaase
      if (this.fileType === FileType.BOTH) {
        if (this.fileState === FileState.UPLOAD_DONE) {
          this.removeFromUploadList();
        } else {
          this.fileState = FileState.EXISTS;
        }
      }
    },
    fileState() {
      this.$emit('stateChange');
    },
    fillWidth() {
      TweenLite.to(this, 0.3, { animatedFillWidth: this.fillWidth, ease: Expo.easeOut });
    },
  },
  computed: {
    fileType() {
      if (this.userFile && this.uploadFile) {
        return FileType.BOTH;
      }
      if (this.userFile) {
        return FileType.USER;
      }

      return FileType.UPLOAD;
    },
    fillWidth() {
      if (
        this.fileType === FileType.UPLOAD ||
        (this.fileType === FileType.BOTH && this.fileState !== FileState.EXISTS)
      ) {
        return this.uploadProgress * 100;
      }

      return 100;
    },
    fileSize() {
      return (this.userFile || this.uploadFile).size;
    },
  },
  methods: {
    removeFromUploadList() {
      if (this.uploadFile) {
        this.fileState = FileState.IDLE;
        this.$emit('fileUploaded', this.uploadFile);
      } else {
        // eslint-disable-next-line
        console.error('Cannot remove from uploadlist');
      }
    },
    upload() {
      const storage = firebase.storage();
      const userId = firebase.auth().currentUser.uid;
      let folderPath;
      if (this.isPublic) {
        folderPath = firebasePath.storage.PUBLIC_SAMPLES;
      } else {
        folderPath = `${firebasePath.storage.USER_SAMPLES}/${userId}`;
      }
      const folderRef = storage.ref(folderPath);
      const fileRef = folderRef.child(this.uploadFile.name);
      this.fileState = FileState.UPLOADING;

      this.uploadTask = fileRef.put(this.uploadFile);
      this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        if (snapshot.bytesTransferred === snapshot.totalBytes) {
          this.fileState = FileState.UPLOAD_DONE;

          if (this.fileType === FileType.BOTH) {
            // already exists in userlist, so we can remove it from uploads
            this.removeFromUploadList();
          } else {
            // other case is that it's FileType.UPLOAD, the reason we dont
            // remove it in this case is to keep the uploaded item in the
            // list, until the database has it. So we watch the change in
            // fileType, and remove it there
          }
        }

        this.uploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
      });
    },
    cancelOverwrite() {
      this.removeFromUploadList();
    },
    removeUserFile() {
      this.fileState = FileState.REMOVING;
      firebase
        .storage()
        .ref(this.userFile.path)
        .child(this.userFile.name)
        .delete()
        .then(() => {
          // console.log('done');
        });
    },
  },
};
