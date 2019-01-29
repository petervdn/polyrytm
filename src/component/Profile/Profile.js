import firebasePath from '../../firebase/firebasePath';
import { getFirebaseValue } from '../../firebase/firebaseUtils';
import RytmList from '../RytmList';

export default {
  name: 'Profile',
  props: ['userId'],
  components: {
    RytmList,
  },
  mounted() {
    getFirebaseValue(`${firebasePath.database.USERS}/${this.userId}`).then(user => {
      this.user = user;
      this.publicRytms = user[firebasePath.database.PUBLIC_RYTMS_SHORT];
      this.loadComplete = true;
    });
  },
  data() {
    return {
      loadComplete: false,
      user: null,
      publicRytms: [],
    };
  },
};
