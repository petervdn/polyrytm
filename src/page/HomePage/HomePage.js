import RytmList from '../../component/RytmList';

export default {
  name: 'HomePage',
  components: {
    RytmList,
  },
  mounted() {
    // getFirebaseValue(firebasePath.database.PUBLIC_RYTMS_SHORT).then(value => {
    //   this.rytms = value;
    // });
  },
  data() {
    return {
      isLoading: true,
      rytms: [],
    };
  },
};
