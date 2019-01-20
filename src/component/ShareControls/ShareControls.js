import { mapActions, mapMutations, mapState } from 'vuex';
import { projectStore } from 'store/module/project/project';

export default {
	name: 'ShareControls',
	methods: {
		save() {
			this.storeProject();
		},
		...mapActions({
			storeProject: projectStore.actions.storeProject,
		}),
		...mapMutations({
			updateName: projectStore.mutations.updateName,
			updateAuthor: projectStore.mutations.updateAuthor,
			updateLink: projectStore.mutations.updateLink,
		}),
		onNameInputUpdate(event) {
			this.updateName(event.target.value);
		},
		onAuthorInputUpdate(event) {
			this.updateAuthor(event.target.value);
		},
		onLinkInputUpdate(event) {
			this.updateLink(event.target.value);
		},
	},
	computed: {
		...mapState('project', ['name', 'author', 'link']),
	},
};
