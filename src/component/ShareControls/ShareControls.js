import { mapActions, mapMutations, mapState } from 'vuex';
import { projectStore } from '../../store/module/project/project';

export default {
  name: 'ShareControls',
  methods: {
    save() {
      this.storeProject();
    },
    ...mapActions({
      storeProject: projectStore.STORE_PROJECT,
    }),
    ...mapMutations({
      setTitle: projectStore.SET_TITLE,
    }),
    onTitleUpdate(event) {
      this.setTitle(event.target.value);
    },
  },
  data() {
    return {
      localTitle: null,
    };
  },
  created() {
    this.localTitle = this.title;
  },
  computed: {
    ...mapState({
      title: state => state.project.title,
    }),
  },
};
