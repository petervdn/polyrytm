import * as firebase from 'firebase';
import StorageSpace from '../StorageSpace';
import UserSampleListItem from '../UserSampleListItem';
import firebasePath from '../../firebase/firebasePath';
import { uniqueArray } from '../../util/miscUtils';

export default {
  name: 'SampleManager',
  components: {
    StorageSpace,
    UserSampleListItem, // todo rename this, not only for user (also public)
  },
  props: ['isPublic'],
  data() {
    return {
      uploadFiles: [],
      userFiles: [],
      uploadEnabled: true,
      maxSize: 1024 * 1024 * 20, // todo get this from db?
    };
  },
  mounted() {
    let dbPath;
    if (this.isPublic) {
      dbPath = firebasePath.database.PUBLIC_SAMPLES;
    } else {
      dbPath = `${firebasePath.database.USER_SAMPLES}/${firebase.auth().currentUser.uid}`;
    }

    firebase
      .database()
      .ref(dbPath)
      .on('value', snapshot => {
        const result = snapshot.val() || [];
        this.userFiles = Object.keys(result).map(key => result[key]);
      });
  },
  methods: {
    checkUploadEnabled() {
      this.$nextTick(() => {
        if (this.$refs.listItem) {
          this.uploadEnabled = this.$refs.listItem.every(item => item.fileState === 'idle');
        } else {
          this.uploadEnabled = true;
        }
      });
    },
    onFileSelectionChange() {
      if (this.$refs.fileSelect.files.length) {
        this.uploadFiles = Array.from(this.$refs.fileSelect.files);

        // reset inputfield
        this.$refs.fileSelect.value = ''; // todo set to null?
      }
    },
    addSamples() {
      // todo set correct auth rules on storage
      this.$refs.fileSelect.click();
    },
    onSampleStateChange() {
      this.checkUploadEnabled();
    },
    onFileUploaded(uploadedFile) {
      // remove file from uploads
      this.uploadFiles = this.uploadFiles.filter(file => file !== uploadedFile);
    },
  },
  computed: {
    usedSize() {
      return this.userFiles.reduce((sum, current) => sum + current.size, 0);
    },
    fileNames() {
      const names = this.userFiles.concat(this.uploadFiles).map(entry => entry.name);
      return uniqueArray(names);
    },
  },
  watch: {
    fileNames() {
      this.checkUploadEnabled();
    },
  },
};
